// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { CustomerReceipt } from "@/templates/emails/CustomerReceipt";
import { OwnerNotification } from "@/templates/emails/OwnerNotification";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Reusable update method
async function updateReservationStatus(sessionId: string, status: string) {
  if (!sessionId) return;

  console.log(`🔄 Updating reservation (${sessionId}) → ${status}`);

  await prisma.reservation.updateMany({
    where: { stripeSessionId: sessionId },
    data: { status },
  });
}

export async function POST(req: Request) {
  console.log("🔥 Webhook hit");

  const hdrs = await headers();
  const sig = hdrs.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error("❌ Missing Stripe signature or webhook secret");
    return NextResponse.json({ received: true });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("❌ Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const type = event.type;
  console.log("📨 Event received:", type);

  // ============================================================
  // 🟢 1. SUCCESS — checkout.session.completed
  // ============================================================
  if (type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata ?? {};

    console.log("✔ Checkout completed:", session.id);

    const {
      carId,
      carName,
      insuranceTitle,
      driverName,
      driverEmail,
      driverPhone,
      pickupDate,
      dropoffDate,
      pickupTime,
      dropoffTime,
      session_id,
    } = metadata;

    const email = session.customer_email ?? driverEmail;
    const amountTotal = (session.amount_total ?? 0) / 100;

    if (!email) {
      console.error("❌ Missing email");
      return NextResponse.json({ received: true });
    }

    try {
      const reservation = await prisma.$transaction(async (tx) => {
        const existing = await tx.reservation.findUnique({
          where: { stripeSessionId: session.id },
        });

        if (existing) {
          console.log("⚠ Existing reservation — skipping duplicate webhook");
          return existing;
        }

        const user = await tx.user.upsert({
          where: { email },
          update: { name: driverName, phone: driverPhone },
          create: {
            email,
            name: driverName ?? null,
            phone: driverPhone ?? null,
          },
        });

        const reservation = await tx.reservation.create({
          data: {
            stripeSessionId: session.id,
            userId: user.id,
            carId: Number(carId),
            startDate: new Date(`${pickupDate}T${pickupTime}:00`),
            endDate: new Date(`${dropoffDate}T${dropoffTime}:00`),
            totalCost: amountTotal,
            status: "confirmed",
          },
        });

        await tx.payment.create({
          data: {
            reservationId: reservation.id,
            amount: amountTotal,
            status: "paid",
            method: "card",
            transactionId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id ?? "",
            paidAt: new Date(),
          },
        });

        return reservation;
      });

      // Customer email
      resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: email,
        subject: "Your Reservation Confirmation",
        react: CustomerReceipt({
          name: driverName!,
          reservationId: reservation.id,
          pickupDate,
          pickupTime,
          dropoffDate,
          dropoffTime,
          carName,
          insurance: insuranceTitle ?? "",
          total: amountTotal,
        }),
      });

      // Owner email
      resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: process.env.OWNER_EMAIL!,
        subject: "New Car Rental Booking",
        react: OwnerNotification({
          reservationId: reservation.id,
          customerEmail: email,
          carName,
          total: amountTotal,
        }),
      });

      console.log("📨 Emails sent!");
    } catch (err) {
      console.error("❌ Error saving reservation/payment:", err);
    }

    return NextResponse.json({ received: true });
  }

  // ============================================================
  // 🔴 2. FAILED — payment_intent.payment_failed
  // ============================================================
  if (type === "payment_intent.payment_failed") {
    const pi = event.data.object as Stripe.PaymentIntent;

    console.log("❌ Payment failed:", pi.id);

    await updateReservationStatus(pi.metadata?.session_id ?? "", "failed");

    return NextResponse.json({ received: true });
  }

  // ============================================================
  // 🟠 3. EXPIRED SESSION — checkout.session.expired
  // ============================================================
  if (type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("⏳ Checkout expired:", session.id);

    await updateReservationStatus(session.id, "failed");

    return NextResponse.json({ received: true });
  }

  // ============================================================
  // 🟡 4. ASYNC PAYMENT FAILED
  // ============================================================
  if (type === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("❌ Async payment failed:", session.id);

    await updateReservationStatus(session.id, "failed");

    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
