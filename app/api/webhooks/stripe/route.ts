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

export async function POST(req: Request) {
  console.log("🔥 Webhook hit!");

  const hdrs = await headers();
  const sig = hdrs.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log("🔍 Headers received:", Object.fromEntries(hdrs.entries()));
  console.log("🔑 Signature header:", sig);
  console.log("🔐 Webhook secret loaded:", !!webhookSecret);

  if (!sig || !webhookSecret) {
    console.error("❌ Missing Stripe signature or webhook secret");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    console.log("📩 Raw body received:", rawBody.slice(0, 200) + "...");

    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);

    console.log("✅ Webhook signature validated!");
    console.log("📨 Event type:", event.type);
  } catch (err) {
    console.error("❌ Stripe webhook signature failure:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // --------------------------------------------------------------------
  // HANDLE CHECKOUT SESSION COMPLETE EVENT
  // --------------------------------------------------------------------
  if (event.type === "checkout.session.completed") {
    console.log("🎉 Processing checkout.session.completed");

    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata ?? {};

    console.log("📦 Session metadata:", metadata);
    console.log("💳 Session object:", {
      id: session.id,
      amount_total: session.amount_total,
      payment_intent: session.payment_intent,
      customer_email: session.customer_email,
    });

    const {
      carId,
      carName,
      insuranceTitle,
      pickupDate,
      dropoffDate,
      pickupTime,
      dropoffTime,
      driverName,
      driverPhone,
      driverEmail,
    } = metadata;

    const customerEmail = session.customer_email ?? driverEmail;

    if (!customerEmail) {
      console.error("❌ Missing customer email");
      return NextResponse.json({ received: true });
    }

    const amountTotal = (session.amount_total ?? 0) / 100;

    try {
      console.log("🛠 Writing to database...");

      const result = await prisma.$transaction(async (tx) => {
        // Prevent duplicate entry
        const existing = await tx.reservation.findUnique({
          where: { stripeSessionId: session.id },
        });

        if (existing) {
          console.log(
            "⚠ Duplicate webhook event → reservation already exists."
          );
          return existing;
        }

        const user = await tx.user.upsert({
          where: { email: customerEmail },
          update: {
            name: driverName || undefined,
            phone: driverPhone || undefined,
          },
          create: {
            email: customerEmail,
            name: driverName ?? null,
            phone: driverPhone ?? null,
          },
        });

        console.log("👤 User saved:", user.id);

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

        console.log("🚗 Reservation created:", reservation.id);

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

        console.log("💰 Payment saved");

        return reservation;
      });

      // ---------------------
      // SEND EMAILS
      // ---------------------
      console.log("📧 Sending emails...");

      resend.emails
        .send({
          from: process.env.FROM_EMAIL!,
          to: customerEmail,
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
        })
        .then(() => console.log("📨 Customer email sent"))
        .catch((e) => console.error("❌ Customer email error:", e));

      resend.emails
        .send({
          from: process.env.FROM_EMAIL!,
          to: process.env.OWNER_EMAIL!,
          subject: "New Car Rental Booking",
          react: OwnerNotification({
            reservationId: result.id,
            customerEmail,
            carName,
            total: amountTotal,
          }),
        })
        .then(() => console.log("📨 Owner email sent"))
        .catch((e) => console.error("❌ Owner email error:", e));

      console.log("🎯 Webhook fully processed!");
    } catch (err) {
      console.error("❌ Webhook DB processing error:", err);
      return NextResponse.json({ error: "Processing failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
