import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId)
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });

  const reservation = await prisma.reservation.findUnique({
    where: { stripeSessionId: sessionId },
  });

  if (!reservation) {
    // Fallback to Stripe session status when no reservation found (e.g., payment failed before webhook persisted)
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const paymentStatus = session.payment_status;
      const sessionStatus = session.status;

      if (paymentStatus === "paid") {
        return NextResponse.json({ status: "confirmed" });
      }

      if (
        sessionStatus === "expired" ||
        paymentStatus === "unpaid" ||
        sessionStatus === "complete"
      ) {
        return NextResponse.json({ status: "failed" });
      }
    } catch (err) {
      console.error("Stripe session lookup failed:", err);
    }

    return NextResponse.json({ status: "pending" });
  }

  return NextResponse.json({
    status: reservation.status, // confirmed | failed | pending
  });
}
