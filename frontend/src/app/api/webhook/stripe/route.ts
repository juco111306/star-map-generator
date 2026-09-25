import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_RESTRICTED_KEY || process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey, { apiVersion: '2024-06-20' as any }) : null;

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe key not configured' }, { status: 500 });
    }

    const body = await req.text();
    const signature = headers().get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: 'Missing stripe signature or webhook secret' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      const frameStyle = session.metadata?.frameStyle;

      console.log(`✅ Payment successful for session: ${session.id}, Order ID: ${orderId}`);

      if (orderId) {
        const backendBase = process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:8000';
        try {
          // 1. Confirm payment on the order timeline
          await fetch(`${backendBase}/api/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              status: 'in_production',
              note: 'Betaling succesvol ontvangen via Stripe (iDEAL/Card). Print-bestand geverifieerd.',
            }),
          });

          // 2. If physical order, dispatch to Gelato Print-on-Demand
          if (frameStyle !== 'digital') {
            console.log(`📦 Dispatching order ${orderId} to Gelato...`);
            const gelatoRes = await fetch(`${backendBase}/api/orders/${orderId}/gelato-submit`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
            });
            const gelatoData = await gelatoRes.json().catch(() => null);
            console.log(`Gelato dispatch result for ${orderId}:`, gelatoData);
          }
        } catch (dispatchErr) {
          console.error(`Error notifying backend/Gelato for order ${orderId}:`, dispatchErr);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook handler failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
