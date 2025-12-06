// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
<<<<<<< HEAD
import { stripe } from "@/lib/stripe";
=======
>>>>>>> 633b30a68a2fe01490639401b60ab81c5bc6d1c1
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { CustomerReceipt } from "@/templates/emails/CustomerReceipt";
import { OwnerNotification } from "@/templates/emails/OwnerNotification";
<<<<<<< HEAD

export const runtime = "nodejs";

export async function POST(req: Request) {
  const hdrs = await headers();
  const sig = hdrs.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
=======
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
>>>>>>> 633b30a68a2fe01490639401b60ab81c5bc6d1c1
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
<<<<<<< HEAD
    console.error("Stripe webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata ?? {};

    const customerEmail = session.customer_email ?? metadata.driverEmail ?? "";

    const amountTotal = (session.amount_total ?? 0) / 100;
=======
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
>>>>>>> 633b30a68a2fe01490639401b60ab81c5bc6d1c1

    const {
      carId,
      carName,
      insuranceTitle,
<<<<<<< HEAD
=======
      driverName,
      driverEmail,
      driverPhone,
>>>>>>> 633b30a68a2fe01490639401b60ab81c5bc6d1c1
      pickupDate,
      dropoffDate,
      pickupTime,
      dropoffTime,
<<<<<<< HEAD
      driverName,
      driverPhone,
    } = metadata;

    try {
      const result = await prisma.$transaction(async (tx) => {
        // 1. create/find user
        const user = await tx.user.upsert({
          where: { email: customerEmail },
          update: {
            name: driverName || undefined,
            phone: driverPhone || undefined,
          },
          create: {
            email: customerEmail,
=======
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
>>>>>>> 633b30a68a2fe01490639401b60ab81c5bc6d1c1
            name: driverName ?? null,
            phone: driverPhone ?? null,
          },
        });

<<<<<<< HEAD
        // 2. Reservation
        const reservation = await tx.reservation.create({
          data: {
            userId: user.id,
            carId: Number(carId),
            insurancePlanId: null,
=======
        const reservation = await tx.reservation.create({
          data: {
            stripeSessionId: session.id,
            userId: user.id,
            carId: Number(carId),
>>>>>>> 633b30a68a2fe01490639401b60ab81c5bc6d1c1
            startDate: new Date(`${pickupDate}T${pickupTime}:00`),
            endDate: new Date(`${dropoffDate}T${dropoffTime}:00`),
            totalCost: amountTotal,
            status: "confirmed",
<<<<<<< HEAD
            longTermDiscount: false,
          },
        });

        // 3. Payment
=======
          },
        });

>>>>>>> 633b30a68a2fe01490639401b60ab81c5bc6d1c1
        await tx.payment.create({
          data: {
            reservationId: reservation.id,
            amount: amountTotal,
<<<<<<< HEAD
            method: "card",
            status: "paid",
            transactionId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id ?? null,
=======
            status: "paid",
            method: "card",
            transactionId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id ?? "",
>>>>>>> 633b30a68a2fe01490639401b60ab81c5bc6d1c1
            paidAt: new Date(),
          },
        });

        return reservation;
      });

<<<<<<< HEAD
      // ------------------------------------
      // 📧 SEND EMAILS
      // ------------------------------------

      // Email to customer
      await resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: metadata.driverEmail!,
        subject: "Your Car Rental Reservation Confirmation",
        react: CustomerReceipt({
          name: metadata.driverName!,
          reservationId: result.id,
=======
      // Customer email
      resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: email,
        subject: "Your Reservation Confirmation",
        react: CustomerReceipt({
          name: driverName!,
          reservationId: reservation.id,
>>>>>>> 633b30a68a2fe01490639401b60ab81c5bc6d1c1
          pickupDate,
          pickupTime,
          dropoffDate,
          dropoffTime,
          carName,
          insurance: insuranceTitle ?? "",
          total: amountTotal,
        }),
      });

<<<<<<< HEAD
      // Email to owner
      await resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: process.env.OWNER_EMAIL!,
        subject: "New Car Rental Booking Received",
        react: OwnerNotification({
          reservationId: result.id,
          customerEmail: metadata.driverEmail!,
=======
      // Owner email
      resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: process.env.OWNER_EMAIL!,
        subject: "New Car Rental Booking",
        react: OwnerNotification({
          reservationId: reservation.id,
          customerEmail: email,
>>>>>>> 633b30a68a2fe01490639401b60ab81c5bc6d1c1
          carName,
          total: amountTotal,
        }),
      });

<<<<<<< HEAD
      console.log("Emails sent successfully.");
    } catch (err) {
      console.error("Webhook DB or Email error:", err);
      return NextResponse.json(
        { error: "Webhook processing failed" },
        { status: 500 }
      );
    }
=======
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
>>>>>>> 633b30a68a2fe01490639401b60ab81c5bc6d1c1
  }

  return NextResponse.json({ received: true });
}
