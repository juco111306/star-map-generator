import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_RESTRICTED_KEY;
const stripe = stripeKey
  ? new Stripe(stripeKey, {
      apiVersion: "2024-06-20" as any,
    })
  : null;

function isSupportedDeliveryCountry(rawCountry?: string): boolean {
  if (!rawCountry) return false;
  const c = rawCountry.trim().toLowerCase();
  if (['nederland', 'netherlands', 'the netherlands', 'holland', 'nl'].includes(c)) return true;
  if (['belgië', 'belgie', 'belgium', 'be'].includes(c)) return true;
  if (['duitsland', 'germany', 'deutschland', 'de'].includes(c)) return true;
  if (['oostenrijk', 'austria', 'österreich', 'at'].includes(c)) return true;
  if (['zwitserland', 'switzerland', 'schweiz', 'ch'].includes(c)) return true;
  if (['verenigd koninkrijk', 'united kingdom', 'uk', 'gb'].includes(c)) return true;
  if (['verenigde staten', 'united states', 'usa', 'us'].includes(c)) return true;
  if (['frankrijk', 'france', 'fr'].includes(c)) return true;
  if (['ierland', 'ireland', 'ie'].includes(c)) return true;
  if (['spanje', 'spain', 'españa', 'es'].includes(c)) return true;
  if (['italië', 'italie', 'italy', 'italia', 'it'].includes(c)) return true;
  if (['portugal', 'pt'].includes(c)) return true;
  if (['denemarken', 'dänemark', 'denmark', 'dk'].includes(c)) return true;
  if (['zweden', 'schweden', 'sweden', 'se'].includes(c)) return true;
  if (['noorwegen', 'norwegen', 'norway', 'no'].includes(c)) return true;
  if (['finland', 'finnland', 'fi'].includes(c)) return true;
  if (['luxemburg', 'luxembourg', 'lu'].includes(c)) return true;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      amount,
      email,
      shippingDetails,
      posterSize,
      frameStyle,
      orderId,
      locale,
      currency,
      styleId,
      titleText,
      namesText,
      dateText,
      locationText,
      carrier,
    } = body;

    const isDigital = frameStyle === "digital";
    const country = shippingDetails?.country || "";

    // Reject physical delivery to countries outside Europe, UK, and USA
    if (!isDigital && !isSupportedDeliveryCountry(country)) {
      return NextResponse.json(
        {
          error:
            locale === 'de'
              ? 'Lieferungen sind derzeit nur nach Europa, Großbritannien und in die USA möglich. Zahlungen aus anderen Ländern werden nicht akzeptiert.'
              : locale === 'en'
              ? 'We currently only deliver to European destinations, the United Kingdom, and the United States. Orders from other countries cannot be accepted.'
              : 'Bezorging is momenteel alleen mogelijk binnen Europese landen, het Verenigd Koninkrijk en de Verenigde Staten. Bestellingen naar overige bestemmingen worden niet geaccepteerd.',
        },
        { status: 400 }
      );
    }

    if (!stripe) {
      console.warn("STRIPE_SECRET_KEY or STRIPE_RESTRICTED_KEY is not defined in environment variables.");
      return NextResponse.json(
        { error: "Stripe is nog niet geconfigureerd in Vercel environment variables (STRIPE_SECRET_KEY)." },
        { status: 500 }
      );
    }

    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const origin = `${protocol}://${host}`;

    // Resolve checkout currency
    const requestedCurrency = String(currency || (locale === 'en' ? 'usd' : 'eur')).toLowerCase().trim();
    const stripeCurrency = ['usd', 'gbp', 'eur'].includes(requestedCurrency) ? requestedCurrency : 'eur';

    // Convert amount to cents (e.g., $19 -> 1900, $29 -> 2900)
    const numericAmount = Number(amount) || 19;
    const amountInCents = numericAmount > 100 ? Math.round(numericAmount) : Math.round(numericAmount * 100);

    const activeLocale = locale === 'de' ? 'de' : locale === 'en' ? 'en' : 'nl';

    const productNames: Record<string, string> = {
      nl: "Stellaire • Gepersonaliseerde Sterrenposter",
      de: "Stellaire • Personalisierte Sternenkarte",
      en: "Stellaire • Personalized Custom Star Map",
    };

    const isImperial = ['12x18', '18x24', '24x36'].includes(posterSize);
    const sizeUnit = isImperial ? '″' : ' cm';

    const productDescs: Record<string, string> = {
      nl: isDigital
        ? "Digitaal Hoge Resolutie Vector PDF Bestand (300 DPI)"
        : `${posterSize || "50x70"}${sizeUnit} • Classic Matte Fine-Art Print`,
      de: isDigital
        ? "Digitale Vektor-PDF-Datei in Hochauflösung (300 DPI)"
        : `${posterSize || "50x70"}${sizeUnit} • Museums-Fine-Art-Druck`,
      en: isDigital
        ? "Digital High-Resolution Vector PDF File (300 DPI)"
        : `${posterSize || (isImperial ? "18x24" : "50x70")}${sizeUnit} • Museum Fine-Art Cotton Print`,
    };

    // Dynamically assign valid payment methods per currency to prevent Stripe API errors
    const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] =
      stripeCurrency === 'eur'
        ? ['card', 'ideal', 'bancontact', 'sofort', 'klarna', 'sepa_debit']
        : stripeCurrency === 'gbp'
        ? ['card', 'link', 'klarna']
        : ['card', 'link', 'klarna'];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethodTypes,
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: stripeCurrency,
            product_data: {
              name: productNames[activeLocale],
              description: productDescs[activeLocale],
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/${activeLocale}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId || ""}&amount=${numericAmount}&currency=${stripeCurrency}`,
      cancel_url: `${origin}/${activeLocale}/`,
      metadata: {
        orderId: orderId || "",
        customerEmail: email || "",
        customerName: shippingDetails?.name || "",
        shippingAddress: JSON.stringify(shippingDetails || {}),
        posterSize: posterSize || "",
        frameStyle: frameStyle || "",
        styleId: styleId || "",
        titleText: (titleText || "").slice(0, 450),
        namesText: (namesText || "").slice(0, 450),
        dateText: (dateText || "").slice(0, 450),
        locationText: (locationText || "").slice(0, 450),
        carrier: carrier || "",
        locale: activeLocale,
        currency: stripeCurrency,
      },
    });

    return NextResponse.json({
      checkoutUrl: session.url,
      clientSecret: session.client_secret,
      id: session.id,
    });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
