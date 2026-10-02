import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendOrderConfirmationEmail } from '@/utils/emailSender';

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
      const customerEmail =
        session.customer_details?.email ||
        session.customer_email ||
        session.metadata?.customerEmail;
      const customerName =
        session.customer_details?.name ||
        session.metadata?.customerName;

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

        // 3. Dispatch automated high-deliverability order confirmation email
        if (customerEmail) {
          try {
            console.log(`✉️ Dispatching order confirmation email to ${customerEmail} for order ${orderId}...`);
            let parsedShippingAddress: any = undefined;
            if (session.metadata?.shippingAddress) {
              try {
                parsedShippingAddress = JSON.parse(session.metadata.shippingAddress);
              } catch {
                // Ignore parse error
              }
            }
            if (!parsedShippingAddress && session.shipping_details?.address) {
              const a = session.shipping_details.address;
              parsedShippingAddress = {
                address_line1: a.line1 || undefined,
                address_line2: a.line2 || undefined,
                city: a.city || undefined,
                state: a.state || undefined,
                postal_code: a.postal_code || undefined,
                country: a.country || undefined,
              };
            }

            const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://stellaireshop.com';
            await sendOrderConfirmationEmail({
              orderId,
              customerEmail,
              customerName: customerName || undefined,
              frameStyle: frameStyle || 'digital',
              posterSize: session.metadata?.posterSize || '50x70',
              styleId: session.metadata?.styleId,
              titleText: session.metadata?.titleText,
              namesText: session.metadata?.namesText,
              dateText: session.metadata?.dateText,
              locationText: session.metadata?.locationText,
              carrier: frameStyle === 'digital' ? undefined : (session.metadata?.carrier || 'PostNL'),
              shippingAddress: parsedShippingAddress,
              locale: (session.metadata?.locale as any) || 'nl',
              origin,
            });
          } catch (emailErr) {
            console.error(`Error sending confirmation email for order ${orderId}:`, emailErr);
          }
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook handler failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
