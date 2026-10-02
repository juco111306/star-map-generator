import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/utils/emailSender';
import { OrderEmailParams } from '@/utils/orderEmailTemplate';

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const orderId = params.orderId;

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // Body may be empty if triggered as a simple POST
    }

    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'stellaire-atelier.nl';
    const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const origin = `${protocol}://${host}`;

    // 1. Check if order details are provided in body
    let customerEmail = body.customerEmail || body.email;
    let customerName = body.customerName || body.name;
    let frameStyle = body.frameStyle || body.frame_style;
    let posterSize = body.posterSize || body.poster_size;
    let titleText = body.titleText || body.title_text;
    let namesText = body.namesText || body.names_text;
    let dateText = body.dateText || body.date_text;
    let locationText = body.locationText || body.location_text;
    let shippingAddress = body.shippingAddress || body.shipping_address;
    let carrier = body.carrier;
    let trackingNumber = body.trackingNumber || body.tracking_number;
    let locale = body.locale || 'nl';
    const forceResend = Boolean(body.forceResend);

    // 2. If essential info is missing, try fetching from backend order registry
    if (!customerEmail || !frameStyle) {
      const backendBase = (
        process.env.BACKEND_INTERNAL_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        'https://star-map-generator.onrender.com'
      ).replace(/\/$/, '');

      try {
        const backendRes = await fetch(`${backendBase}/api/orders/${orderId}`, {
          next: { revalidate: 0 },
        });
        if (backendRes.ok) {
          const orderData = await backendRes.json();
          customerEmail = customerEmail || orderData.customer?.email || orderData.customer_email;
          customerName = customerName || orderData.customer?.name || orderData.customer_name;
          frameStyle = frameStyle || orderData.frame_style || 'none';
          posterSize = posterSize || orderData.poster_size || '50x70';
          titleText = titleText || orderData.title_text;
          namesText = namesText || orderData.names_text;
          dateText = dateText || orderData.date_text;
          locationText = locationText || orderData.location_text;
          shippingAddress = shippingAddress || orderData.customer;
          carrier = carrier || orderData.carrier;
          trackingNumber = trackingNumber || orderData.tracking_number;
        }
      } catch (backendErr) {
        console.warn(`[SendConfirmation] Could not query backend for order ${orderId}:`, backendErr);
      }
    }

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Customer email address is required to dispatch confirmation' },
        { status: 400 }
      );
    }

    const emailParams: OrderEmailParams = {
      orderId,
      customerName,
      customerEmail,
      frameStyle: frameStyle || 'digital',
      posterSize: posterSize || '50x70',
      titleText: titleText || 'De Nacht Waarin We Elkaar Vonden',
      namesText: namesText || '',
      dateText: dateText || '',
      locationText: locationText || '',
      shippingAddress: shippingAddress || undefined,
      carrier: carrier || (frameStyle === 'digital' ? undefined : 'PostNL'),
      trackingNumber: trackingNumber || undefined,
      locale: locale === 'de' ? 'de' : locale === 'en' ? 'en' : 'nl',
      origin,
    };

    const result = await sendOrderConfirmationEmail(emailParams, forceResend);

    return NextResponse.json({
      success: result.success,
      provider: result.provider,
      messageId: result.messageId,
      simulated: result.simulated,
      error: result.error,
    });
  } catch (error: any) {
    console.error(`[SendConfirmation] Handler exception for order ${orderId}:`, error);
    return NextResponse.json(
      { error: error?.message || 'Failed to dispatch confirmation email' },
      { status: 500 }
    );
  }
}
