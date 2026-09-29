import { NextRequest, NextResponse } from 'next/server';
import { generateStarMapPdfBlob } from '@/utils/pdfGenerator';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const orderId = params.orderId || 'STL-ORDER';

  const backendBase = (
    process.env.BACKEND_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'https://star-map-generator.onrender.com'
  ).replace(/\/$/, "");

  // 1. Try to fetch from backend if running
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const backendRes = await fetch(`${backendBase}/api/orders/${orderId}/pdf`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (backendRes.ok) {
      const buffer = await backendRes.arrayBuffer();
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${orderId}_print_ready_300dpi.pdf"`,
          'Content-Length': buffer.byteLength.toString(),
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }
  } catch (err) {
    console.warn(`Direct backend PDF fetch for ${orderId} failed or timed out:`, err);
  }

  // 2. Fetch order metadata to reconstruct exact custom poster specs
  let orderData: any = null;
  try {
    const orderRes = await fetch(`${backendBase}/api/orders/${orderId}`);
    if (orderRes.ok) {
      orderData = await orderRes.json();
    }
  } catch (err) {
    console.warn(`Backend metadata fetch for ${orderId} failed:`, err);
  }

  // 3. Generate crisp 300 DPI vector PDF via Next.js serverless engine (Zero Failure Fallback)
  try {
    const url = new URL(request.url);
    const styleId = orderData?.style_id || url.searchParams.get('style') || 'midnight_classic';
    const posterSize = (orderData?.poster_size || url.searchParams.get('size') || '50x70') as any;
    const title = orderData?.title_text || url.searchParams.get('title') || 'The Night We Met';
    const names = orderData?.names_text || url.searchParams.get('names') || 'Sophie & Daan';
    const date = orderData?.date_text || url.searchParams.get('date') || '22 September 2026';
    const location = orderData?.location_text || url.searchParams.get('location') || 'Amsterdam, Nederland';
    const locale = url.searchParams.get('locale') || 'nl';

    const pdfBytes = await generateStarMapPdfBlob(
      {
        styleId,
        posterSize,
        frameStyle: (orderData?.frame_style as any) || 'none',
        titleBlock: {
          text: title,
          font: 'Cinzel',
          size: 38,
          tracking: 3,
          uppercase: true,
          italic: false,
          enabled: true,
        },
        namesBlock: {
          text: names,
          font: 'Great Vibes',
          size: 51,
          tracking: 1,
          uppercase: false,
          italic: true,
          enabled: !!names,
        },
        dateBlock: {
          text: date,
          font: 'Cinzel',
          size: 15,
          tracking: 2,
          uppercase: true,
          italic: false,
          enabled: true,
        },
        locationBlock: {
          text: location,
          font: 'Cinzel',
          size: 14,
          tracking: 2,
          uppercase: true,
          italic: false,
          enabled: true,
        },
        showCelestialGrid: true,
        showConstellationLines: true,
        showMilkyWay: true,
        showMattedBorder: false,
        dividerStyle: 'diamond',
      },
      orderId,
      locale
    );

    const buffer = Buffer.from(pdfBytes);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${orderId}_print_ready_300dpi.pdf"`,
        'Content-Length': buffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err: any) {
    console.error('Serverless PDF generation error:', err);
    return NextResponse.json(
      { error: 'PDF generation failed: ' + (err.message || 'Unknown error') },
      { status: 500 }
    );
  }
}
