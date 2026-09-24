import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  const body = await req.text(); 
  const secret = process.env.PAYSTACK_SECRET_KEY;
  
  if (!secret) return NextResponse.json({ error: 'Missing secret' }, { status: 500 });

  const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');
  const signature = req.headers.get('x-paystack-signature');

  if (hash !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === 'charge.success') {
    const { metadata, reference } = event.data;
    
    // Push to Gelato
    await fetch('https://order.gelatoapis.com/v3/orders', {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.GELATO_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderReferenceId: reference,
        currency: "EUR",
        shippingAddress: metadata.shippingDetails,
        products: [{
          itemReferenceId: "star-map-1",
          productUid: "classic-matte-paper-wooden-frame-50x70", 
          quantity: 1,
          files: [{ type: "default", url: metadata.designUrl }]
        }]
      })
    });
  }

  return NextResponse.json({ message: 'Webhook received' });
}
