import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const plans = await prisma.insurancePlan.findMany({
      where: { active: true },
      orderBy: { dailyPrice: "asc" },
    });

    // Normalize Prisma Decimal → number
    const formatted = plans.map((plan) => ({
      ...plan,
      dailyPrice: Number(plan.dailyPrice),
      excessAmount: plan.excessAmount ? Number(plan.excessAmount) : 0,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Failed to load insurance plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
