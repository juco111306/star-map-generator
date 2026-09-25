import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_RESTRICTED_KEY;
const stripe = stripeKey
  ? new Stripe(stripeKey, {
      apiVersion: "2024-06-20" as any,
    })
  : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, email, shippingDetails, posterSize, frameStyle, orderId } = body;

    if (!stripe) {
      console.warn("STRIPE_SECRET_KEY or STRIPE_RESTRICTED_KEY is not defined in environment variables.");
      return NextResponse.json(
        { error: "Stripe is nog niet geconfigureerd in Vercel environment variables (STRIPE_SECRET_KEY)." },
        { status: 500 }
      );
    }

    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const origin = `${protocol}://${host}`;

    // Convert amount to cents (e.g., €19 -> 1900, €29 -> 2900)
    const numericAmount = Number(amount) || 19;
    const amountInCents = numericAmount > 100 ? Math.round(numericAmount) : Math.round(numericAmount * 100);

    const isDigital = frameStyle === "digital";
    const productName = "Stellaire • Gepersonaliseerde Sterrenposter";
    const productDesc = isDigital
      ? "Digitaal Hoge Resolutie Vector PDF Bestand (300 DPI)"
      : `${posterSize || "50x70"} cm • Classic Matte Fine-Art Print`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal", "bancontact"],
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: productName,
              description: productDesc,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId || ""}&amount=${numericAmount}`,
      cancel_url: `${origin}/`,
      metadata: {
        orderId: orderId || "",
        customerEmail: email || "",
        customerName: shippingDetails?.name || "",
        shippingAddress: JSON.stringify(shippingDetails || {}),
        posterSize: posterSize || "",
        frameStyle: frameStyle || "",
      },
    });

    return NextResponse.json({
      checkoutUrl: session.url,
      clientSecret: session.client_secret,
      id: session.id,
    });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
