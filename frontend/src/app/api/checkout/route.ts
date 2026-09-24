import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, amount, shippingDetails, designUrl } = body;

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: amount * 100, // Paystack uses cents
      callback_url: 'https://star-map-generator-iota.vercel.app/success',
      metadata: { shippingDetails, designUrl },
    }),
  });

  const data = await response.json();
  return NextResponse.json({ checkoutUrl: data.data.authorization_url });
}
