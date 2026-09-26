import { NextRequest, NextResponse } from 'next/server';
import { generateStarMapPdfBlob } from '@/utils/pdfGenerator';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const orderId = params.orderId || 'STL-ORDER';

  // 1. Try to fetch from backend if running
  const backendBase =
    process.env.BACKEND_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'http://127.0.0.1:8000';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

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
  } catch {
    // Backend offline or running in serverless environment
  }

  // 2. Generate crisp 300 DPI PDF directly via Next.js serverless engine
  try {
    const url = new URL(request.url);
    const styleId = url.searchParams.get('style') || 'midnight_classic';
    const posterSize = (url.searchParams.get('size') || '50x70') as any;
    const title = url.searchParams.get('title') || 'The Night We Met';
    const names = url.searchParams.get('names') || '';
    const date = url.searchParams.get('date') || '22 September 2026';
    const location = url.searchParams.get('location') || 'Amsterdam, Nederland';

    const pdfBytes = await generateStarMapPdfBlob(
      {
        styleId,
        posterSize,
        titleBlock: {
          text: title,
          font: 'Playfair Display',
          size: 34,
          tracking: 3,
          uppercase: true,
          italic: false,
          enabled: true,
        },
        namesBlock: {
          text: names,
          font: 'Great Vibes',
          size: 22,
          tracking: 1.5,
          uppercase: false,
          italic: true,
          enabled: !!names,
        },
        dateBlock: {
          text: date,
          font: 'Montserrat',
          size: 16,
          tracking: 2.2,
          uppercase: true,
          italic: false,
          enabled: true,
        },
        locationBlock: {
          text: location,
          font: 'Montserrat',
          size: 14,
          tracking: 1.8,
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
      orderId
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
