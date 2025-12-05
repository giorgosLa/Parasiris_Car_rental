import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const session_id = url.searchParams.get("session_id");

  if (!session_id) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent.charges"],
    });

    const paymentIntent = session.payment_intent as Stripe.PaymentIntent | null;

    let receiptUrl: string | null = null;

    if (
      paymentIntent &&
      typeof paymentIntent === "object" &&
      "charges" in paymentIntent &&
      Array.isArray((paymentIntent as any).charges?.data)
    ) {
      receiptUrl = (paymentIntent as any).charges.data[0]?.receipt_url ?? null;
    }

    return NextResponse.json({
      id: session.id,
      status: session.payment_status,
      amount_total: session.amount_total,
      currency: session.currency,
      receipt_url: receiptUrl,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
