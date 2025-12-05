// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { CustomerReceipt } from "@/templates/emails/CustomerReceipt";
import { OwnerNotification } from "@/templates/emails/OwnerNotification";

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
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata ?? {};

    const customerEmail = session.customer_email ?? metadata.driverEmail ?? "";

    const amountTotal = (session.amount_total ?? 0) / 100;

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
            name: driverName ?? null,
            phone: driverPhone ?? null,
          },
        });

        // 2. Reservation
        const reservation = await tx.reservation.create({
          data: {
            userId: user.id,
            carId: Number(carId),
            insurancePlanId: null,
            startDate: new Date(`${pickupDate}T${pickupTime}:00`),
            endDate: new Date(`${dropoffDate}T${dropoffTime}:00`),
            totalCost: amountTotal,
            status: "confirmed",
            longTermDiscount: false,
          },
        });

        // 3. Payment
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
          pickupDate,
          pickupTime,
          dropoffDate,
          dropoffTime,
          carName,
          insurance: insuranceTitle ?? "",
          total: amountTotal,
        }),
      });

      // Email to owner
      await resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: process.env.OWNER_EMAIL!,
        subject: "New Car Rental Booking Received",
        react: OwnerNotification({
          reservationId: result.id,
          customerEmail: metadata.driverEmail!,
          carName,
          total: amountTotal,
        }),
      });

      console.log("Emails sent successfully.");
    } catch (err) {
      console.error("Webhook DB or Email error:", err);
      return NextResponse.json(
        { error: "Webhook processing failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
