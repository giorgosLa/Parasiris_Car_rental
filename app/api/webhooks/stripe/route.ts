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

export async function POST(req: Request) {
  const hdrs = await headers();
  const sig = hdrs.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

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

  const type = event.type;

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
      const reservation = await prisma.$transaction(async (tx) => {
        const existing = await tx.reservation.findUnique({
          where: { stripeSessionId: session.id },
        });

        if (existing) {
          return existing;
        }

        const user = await tx.user.upsert({
          where: { email },
          update: {
            name: driverName ?? undefined,
            phone: driverPhone ?? undefined,
          },
          create: {
            email,
            name: driverName ?? null,
            phone: driverPhone ?? null,
          },
        });

        const res = await tx.reservation.create({
          data: {
            stripeSessionId: session.id,
            userId: user.id,
            carId: carIdNumber,
            insurancePlanId: null,
            startDate: new Date(`${pickupDate}T${pickupTime}:00`),
            endDate: new Date(`${dropoffDate}T${dropoffTime}:00`),
            totalCost: amountTotal,
            status: "confirmed",
          },
        });

        await tx.payment.create({
          data: {
            reservationId: res.id,
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

        return res;
      });

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
    const sessionId =
      (pi.metadata && (pi.metadata as Record<string, string>).session_id) || "";
    await updateReservationStatus(sessionId, "failed");
    return NextResponse.json({ received: true });
  }

  // Checkout async payment failed (SCA, bank declines etc)
  if (type === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await updateReservationStatus(session.id, "failed");
    return NextResponse.json({ received: true });
  }

  // Checkout session expired (never paid)
  if (type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    await updateReservationStatus(session.id, "failed");
    return NextResponse.json({ received: true });
  }

  // Default
  return NextResponse.json({ received: true });
}
