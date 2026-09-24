import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, amount, shippingDetails, designUrl } = body;

    // Use Paystack Live Secret Key directly from environment or fallback safely
    const paystackKey = process.env.PAYSTACK_SECRET_KEY || '';

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email || 'customer@stellaireatelier.com',
        amount: Math.round((amount || 59) * 100), // Amount in cents/pesewas/cents equivalent
        currency: 'EUR',
        callback_url: 'https://star-map-generator-iota.vercel.app/?success=true',
        metadata: {
          shipping_details: shippingDetails,
          design_url: designUrl,
        },
      }),
    });

    const data = await response.json();

    if (data.status && data.data?.authorization_url) {
      return NextResponse.json({ checkoutUrl: data.data.authorization_url });
    } else {
      console.error('Payment gateway error:', data);
      // Fallback redirect or error message
      return NextResponse.json({ 
        error: data.message || 'Payment initialization failed' 
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
