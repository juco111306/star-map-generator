import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, amount, shippingDetails, designUrl } = body;

    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Paystack requires amounts in the lowest unit (cents)
        currency: 'EUR',      // 💶 Forces the currency to Euros
        channels: ['card'],   // 💳 Forces the checkout to ONLY show Mastercard/Visa
        metadata: {
          shippingDetails,
          designUrl
        }
      }),
    });

    const paystackData = await paystackRes.json();

    if (paystackData.status) {
      return NextResponse.json({ checkoutUrl: paystackData.data.authorization_url });
    } else {
      return NextResponse.json({ error: paystackData.message }, { status: 400 });
    }
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
