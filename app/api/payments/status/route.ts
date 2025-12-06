import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId)
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });

  const reservation = await prisma.reservation.findUnique({
    where: { stripeSessionId: sessionId },
  });

  if (!reservation) {
    return NextResponse.json({ status: "pending" });
  }

  return NextResponse.json({
    status: reservation.status, // confirmed | failed | pending
  });
}
