import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { CustomerReceipt } from "@/templates/emails/CustomerReceipt";
import { OwnerNotification } from "@/templates/emails/OwnerNotification";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function updateReservationStatus(sessionId: string, status: string) {
  if (!sessionId) return;

  await prisma.reservation.updateMany({
    where: { stripeSessionId: sessionId },
    data: { status },
  });
}

async function upsertReservationFromSession(
  session: Stripe.Checkout.Session,
  status: "pending" | "confirmed" | "failed",
  amountTotalOverride?: number
) {
  const metadata = session.metadata ?? {};

  const email = session.customer_email ?? metadata.driverEmail;
  const driverName = metadata.driverName ?? null;
  const driverPhone = metadata.driverPhone ?? null;
  const carIdNumber = Number(metadata.carId);
  const pickupDate = metadata.pickupDate;
  const dropoffDate = metadata.dropoffDate;
  const pickupTime = metadata.pickupTime;
  const dropoffTime = metadata.dropoffTime;
  const insurancePlanId =
    metadata.insurancePlanId !== undefined &&
    metadata.insurancePlanId !== null &&
    metadata.insurancePlanId !== ""
      ? Number(metadata.insurancePlanId)
      : null;

  if (
    !email ||
    !carIdNumber ||
    Number.isNaN(carIdNumber) ||
    !pickupDate ||
    !dropoffDate ||
    !pickupTime ||
    !dropoffTime
  ) {
    console.error("Missing booking metadata for reservation upsert", metadata);
    return null;
  }

  const startDate = new Date(`${pickupDate}T${pickupTime}:00`);
  const endDate = new Date(`${dropoffDate}T${dropoffTime}:00`);

  const user = await prisma.user.upsert({
    where: { email },
    update: { name: driverName ?? undefined, phone: driverPhone ?? undefined },
    create: { email, name: driverName, phone: driverPhone },
  });

  const totalCost =
    amountTotalOverride ??
    (typeof session.amount_total === "number"
      ? session.amount_total / 100
      : undefined);

  console.log("🔥 Webhook metadata received:", session.metadata);
  console.log("🔥 insurancePlanId RAW:", session.metadata?.insurancePlanId);
  console.log(
    "🔥 Type of insurancePlanId:",
    typeof session.metadata?.insurancePlanId
  );

  const reservation = await prisma.reservation.upsert({
    where: { stripeSessionId: session.id },
    update: {
      userId: user.id,
      carId: carIdNumber,
      insurancePlanId,
      startDate,
      endDate,
      totalCost: totalCost ?? undefined,
      status,
    },
    create: {
      stripeSessionId: session.id,
      userId: user.id,
      carId: carIdNumber,
      insurancePlanId,
      startDate,
      endDate,
      totalCost: totalCost ?? undefined,
      status,
    },
  });
  console.log("[stripe-webhook] reservation saved:", {
    id: reservation.id,
    insurancePlanId: reservation.insurancePlanId,
  });

  return reservation;
}

export async function POST(req: Request) {
  const hdrs = await headers();
  const sig = hdrs.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log("[stripe-webhook] Received request");

  if (!sig || !webhookSecret) {
    console.error("Missing Stripe signature or webhook secret");
    return NextResponse.json({ received: true });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Stripe types may not include newer events; treat as string for comparisons
  const type = event.type as string;
  console.log("[stripe-webhook] Event type:", type);

  // -------------------------
  // SUCCESS EVENT
  // -------------------------
  if (type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata ?? {};

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
    } = metadata;

    const email = session.customer_email ?? driverEmail;
    const amountTotal = (session.amount_total ?? 0) / 100;

    if (!carId || !pickupDate || !dropoffDate || !pickupTime || !dropoffTime) {
      console.error("Missing booking metadata", metadata);
      return NextResponse.json({ received: true });
    }

    const carIdNumber = Number(carId);

    if (Number.isNaN(carIdNumber)) {
      console.error("Invalid carId in metadata", metadata);
      return NextResponse.json({ received: true });
    }

    if (!email) {
      console.error("Missing customer email in session metadata");
      return NextResponse.json({ received: true });
    }

    try {
      console.log(
        "[stripe-webhook] Handling checkout.session.completed for",
        session.id
      );
      const reservation = await upsertReservationFromSession(
        session,
        "confirmed",
        amountTotal
      );

      if (reservation) {
        await prisma.payment.upsert({
          where: { reservationId: reservation.id },
          update: {
            amount: amountTotal,
            status: "paid",
            method: "card",
            transactionId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id ?? "",
            paidAt: new Date(),
          },
          create: {
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
      }

      if (!resend) {
        console.warn("Resend not configured. Skipping email notifications.");
      } else {
        await resend.emails.send({
          from: process.env.FROM_EMAIL!,
          to: email,
          subject: "Your Reservation Confirmation",
          react: CustomerReceipt({
            name: driverName ?? "Customer",
            reservationId: reservation.id,
            pickupDate,
            pickupTime,
            dropoffDate,
            dropoffTime,
            carName: carName ?? "Car rental",
            insurance: insuranceTitle ?? "",
            total: amountTotal,
          }),
        });

        await resend.emails.send({
          from: process.env.FROM_EMAIL!,
          to: process.env.OWNER_EMAIL!,
          subject: "New Car Rental Booking",
          react: OwnerNotification({
            reservationId: reservation.id,
            customerEmail: email,
            carName: carName ?? "Car rental",
            total: amountTotal,
          }),
        });
      }
    } catch (err) {
      console.error("Webhook DB or Email error:", err);
      return NextResponse.json(
        { error: "Webhook processing failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ received: true });
  }

  // -------------------------
  // FAILURE EVENTS
  // -------------------------

  // PaymentIntent failed
  if (type === "payment_intent.payment_failed") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const meta = (pi.metadata || {}) as Record<string, string>;
    const sessionId =
      meta.session_id ||
      meta.checkout_session_id ||
      meta.checkoutSessionId ||
      "";

    console.log(
      "[stripe-webhook] payment_intent.payment_failed; sessionId:",
      sessionId
    );

    if (sessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        await upsertReservationFromSession(session, "failed");
      } catch (err) {
        console.error(
          "Failed to retrieve session for payment_intent failure",
          err
        );
      }
    } else {
      try {
        // Try to locate the Checkout Session via payment_intent reference
        const sessions = await stripe.checkout.sessions.list({
          payment_intent: pi.id,
          limit: 1,
        });
        const found = sessions.data?.[0];
        if (found) {
          await upsertReservationFromSession(found, "failed");
        } else {
          await updateReservationStatus(sessionId, "failed");
        }
      } catch (err) {
        console.error(
          "Failed to lookup Checkout Session for payment_intent",
          err
        );
        await updateReservationStatus(sessionId, "failed");
      }
    }

    return NextResponse.json({ received: true });
  }

  // Checkout payment failed (synchronous payment error)
  if (type === "checkout.session.payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(
      "[stripe-webhook] checkout.session.payment_failed:",
      session.id
    );
    await upsertReservationFromSession(session, "failed");
    return NextResponse.json({ received: true });
  }

  // Checkout async payment failed (SCA, bank declines etc)
  if (type === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(
      "[stripe-webhook] checkout.session.async_payment_failed:",
      session.id
    );
    await upsertReservationFromSession(session, "failed");
    return NextResponse.json({ received: true });
  }

  // Checkout session expired (never paid)
  if (type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("[stripe-webhook] checkout.session.expired:", session.id);
    await upsertReservationFromSession(session, "failed");
    return NextResponse.json({ received: true });
  }

  // Default
  return NextResponse.json({ received: true });
}
