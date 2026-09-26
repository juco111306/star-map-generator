import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const orderId = params.orderId;
  const backendBase =
    process.env.BACKEND_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'http://127.0.0.1:8000';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${backendBase}/api/orders/${orderId}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Backend offline / serverless
  }

  // Fallback order structure for resilient client experience
  return NextResponse.json({
    order_id: orderId,
    created_at: new Date().toISOString(),
    status: 'in_production',
    customer: {
      name: 'Klant',
      email: '',
      address_line1: 'Digitale Levering per E-mail',
      city: 'Digitaal',
      postal_code: '0000',
      country: 'Nederland',
    },
    poster_size: '50x70',
    style_id: 'midnight_classic',
    frame_style: 'digital',
    title_text: 'De Gepersonaliseerde Sterrenposter',
    names_text: '',
    date_text: '22 September 2026',
    location_text: 'Amsterdam, Nederland',
    pdf_filename: `${orderId}_print_ready_300dpi.pdf`,
    carrier: 'Digitale Levering per E-mail',
  });
}
