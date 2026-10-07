import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/utils/emailSender';
import { OrderEmailParams } from '@/utils/orderEmailTemplate';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const orderId = body.orderId || body.order_id;
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'stellaireshop.com';
    const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const origin = `${protocol}://${host}`;

    const customerEmail = body.customerEmail || body.email;
    const customerName = body.customerName || body.name;

    if (!customerEmail) {
      return NextResponse.json({ error: 'Customer email address is required' }, { status: 400 });
    }

    const emailParams: OrderEmailParams = {
      orderId,
      customerName,
      customerEmail,
      frameStyle: body.frameStyle || body.frame_style || 'digital',
      posterSize: body.posterSize || body.poster_size || '50x70',
      titleText: body.titleText || body.title_text || 'De Nacht Waarin We Elkaar Vonden',
      namesText: body.namesText || body.names_text || '',
      dateText: body.dateText || body.date_text || '',
      locationText: body.locationText || body.location_text || '',
      shippingAddress: body.shippingAddress || body.shipping_address || undefined,
      carrier: body.carrier,
      trackingNumber: body.trackingNumber || body.tracking_number,
      locale: body.locale === 'de' ? 'de' : body.locale === 'en' ? 'en' : 'nl',
      origin,
    };

    const result = await sendOrderConfirmationEmail(emailParams, Boolean(body.forceResend));
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Send confirmation API error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to dispatch email' }, { status: 500 });
  }
}
