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

async function updateReservationStatus(sessionId: string, status: string) {
  return prisma.reservation.updateMany({
    where: { stripeSessionId: sessionId },
    data: { status },
  });
}

export async function POST(req: Request) {
  console.log("🔥 Webhook hit!");

  const hdrs = await headers();
  const sig = hdrs.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("❌ Invalid Stripe Signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const eventType = event.type;
  console.log("📨 Event:", eventType);

  //
  // -----------------------------------------------------
  // 🟢 1. SUCCESSFUL PAYMENT — checkout.session.completed
  // -----------------------------------------------------
  //
  if (eventType === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata ?? {};

    const {
      carId,
      carName,
      driverName,
      driverEmail,
      driverPhone,
      insuranceTitle,
      pickupDate,
      dropoffDate,
      pickupTime,
      dropoffTime,
    } = metadata;

    const amountTotal = (session.amount_total ?? 0) / 100;
    const email = session.customer_email ?? driverEmail;

    if (!email) {
      console.error("❌ Missing customer email in metadata");
      return NextResponse.json({ received: true });
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        const existing = await tx.reservation.findUnique({
          where: { stripeSessionId: session.id },
        });

        if (existing) {
          console.log("⚠ Reservation exists (duplicate webhook)");
          return existing;
        }

        const user = await tx.user.upsert({
          where: { email },
          update: {
            name: driverName || undefined,
            phone: driverPhone || undefined,
          },
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
            method: "card",
            status: "paid",
            transactionId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id ?? null,
            paidAt: new Date(),
          },
        });

        return reservation;
      });

      // EMAILS
      resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: email,
        subject: "Your Reservation Confirmation",
        react: CustomerReceipt({
          name: driverName!,
          reservationId: result.id,
          pickupDate,
          pickupTime,
          dropoffDate,
          dropoffTime,
          carName,
          insurance: insuranceTitle ?? "",
          total: amountTotal,
        }),
      });

      resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: process.env.OWNER_EMAIL!,
        subject: "New Car Rental Booking",
        react: OwnerNotification({
          reservationId: result.id,
          customerEmail: email,
          carName,
          total: amountTotal,
        }),
      });
    } catch (err) {
      console.error("❌ DB error:", err);
    }

    return NextResponse.json({ received: true });
  }

  //
  // -----------------------------------------------------
  // 🔴 2. PAYMENT FAILED — payment_intent.payment_failed
  // -----------------------------------------------------
  //
  if (eventType === "payment_intent.payment_failed") {
    const pi = event.data.object as Stripe.PaymentIntent;
    console.log("❌ Payment failed for PI:", pi.id);

    await updateReservationStatus(pi.metadata?.session_id ?? "", "failed");

    return NextResponse.json({ received: true });
  }

  //
  // -----------------------------------------------------
  // 🟠 3. CHECKOUT EXPIRED — checkout.session.expired
  // -----------------------------------------------------
  //
  if (eventType === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("⏳ Checkout expired:", session.id);

    await updateReservationStatus(session.id, "failed");

    return NextResponse.json({ received: true });
  }

  //
  // -----------------------------------------------------
  // 🟡 4. ASYNC (Delayed) PAYMENT FAILED
  // -----------------------------------------------------
  //
  if (eventType === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("❌ Async payment failed:", session.id);

    await updateReservationStatus(session.id, "failed");

    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
