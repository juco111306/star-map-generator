import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, amount, shippingDetails, designUrl } = body;

    const formData = new URLSearchParams();
    formData.append('success_url', 'https://star-map-generator-iota.vercel.app/?success=true');
    formData.append('cancel_url', 'https://star-map-generator-iota.vercel.app/');
    formData.append('mode', 'payment');
    formData.append('customer_email', email || 'customer@stellaireatelier.com');

    formData.append('line_items[0][price_data][currency]', 'eur');
    formData.append('line_items[0][price_data][product_data][name]', 'Gepersonaliseerde Sterrenposter');
    formData.append('line_items[0][price_data][unit_amount]', Math.round((amount || 59) * 100).toString());
    formData.append('line_items[0][quantity]', '1');

    formData.append('payment_method_types[0]', 'ideal');
    formData.append('payment_method_types[1]', 'bancontact');
    formData.append('payment_method_types[2]', 'card');

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.STRIPE_RESTRICTED_KEY}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: formData.toString(),
});

    const stripeData = await stripeRes.json();

    if (stripeData.url) {
      return NextResponse.json({ checkoutUrl: stripeData.url });
    } else {
      console.error('Stripe error:', stripeData);
      return NextResponse.json({ error: stripeData.error?.message || 'Stripe initialization failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
