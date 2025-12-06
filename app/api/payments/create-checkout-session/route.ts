// app/api/payments/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe";

// ----------------------
// 2. ZOD Request Schema
// ----------------------
const CriteriaSchema = z.object({
  pickupLocation: z.string(),
  dropoffLocation: z.string(),
  pickupDate: z.string(),
  dropoffDate: z.string(),
  pickupTime: z.string(),
  dropoffTime: z.string(),
});

const CarSchema = z.object({
  id: z.union([z.string(), z.number()]),
  make: z.string().optional(),
  model: z.string().optional(),
  name: z.string().optional(),
  totalPrice: z.number(),
});

const InsuranceSchema = z
  .object({
    title: z.string(),
    dailyPrice: z.number(),
  })
  .optional();

const DriverSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  zip: z.string().optional(),
});

const CheckoutBodySchema = z.object({
  totalAmount: z.number(),
  car: CarSchema,
  insurance: InsuranceSchema,
  criteria: CriteriaSchema,
  driver: DriverSchema,
});

// ----------------------
// 3. API Handler (POST)
// ----------------------
export async function POST(req: Request) {
  try {
    const json = await req.json();

    // Validate incoming body
    const body = CheckoutBodySchema.parse(json);

    const { totalAmount, car, insurance, criteria, driver } = body;

    const amountInCents = Math.round(totalAmount * 100);

    // Prefer car.name if exists, else fallback to make + model
    const carName =
      car.name ??
      `${car.make ?? "Car"} ${car.model ?? ""}`.trim() ??
      "Car rental";

    // ----------------------
    // 4. Create Stripe Session
    // ----------------------
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: amountInCents,
            product_data: {
              name: `Car rental - ${carName}`,
              description: `${criteria.pickupLocation} → ${criteria.dropoffLocation}`,
            },
          },
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?canceled=1`,

      // All metadata must be string values
      metadata: {
        carId: String(car.id),
        carName,
        insuranceTitle: insurance?.title ?? "",
        pickupLocation: criteria.pickupLocation,
        dropoffLocation: criteria.dropoffLocation,
        pickupDate: criteria.pickupDate,
        pickupTime: criteria.pickupTime,
        dropoffDate: criteria.dropoffDate,
        dropoffTime: criteria.dropoffTime,
        driverName: driver.name,
        driverEmail: driver.email,
        driverPhone: driver.phone,
        totalAmount: String(totalAmount),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err);

    // Zod validation error
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: err.issues },
        { status: 400 }
      );
    }

    // Stripe or system error
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Unknown Stripe session error",
      },
      { status: 500 }
    );
  }
}
