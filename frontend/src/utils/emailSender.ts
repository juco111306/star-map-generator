import { generateOrderConfirmationEmail, OrderEmailParams, GeneratedEmail } from './orderEmailTemplate';

export interface SendEmailResult {
  success: boolean;
  provider: 'resend' | 'sendgrid' | 'brevo' | 'postmark' | 'simulated';
  messageId?: string;
  error?: string;
  simulated?: boolean;
}

// In-memory deduplication set to prevent double-sends within a 15-minute window
// (e.g. if Stripe webhook and PaymentSuccessPage fire simultaneously)
const sentOrderCache = new Map<string, number>();
const DEDUP_WINDOW_MS = 15 * 60 * 1000;

export async function sendOrderConfirmationEmail(
  params: OrderEmailParams,
  forceResend = false
): Promise<SendEmailResult> {
  const cacheKey = `${params.orderId}:${params.customerEmail.toLowerCase().trim()}`;
  const lastSent = sentOrderCache.get(cacheKey);
  const now = Date.now();

  if (!forceResend && lastSent && now - lastSent < DEDUP_WINDOW_MS) {
    console.log(`[Email] Deduplication hit for order ${params.orderId} (${params.customerEmail}). Skipping duplicate send.`);
    return {
      success: true,
      provider: 'simulated',
      messageId: `dedup_${lastSent}`,
      simulated: true,
    };
  }

  const emailContent: GeneratedEmail = generateOrderConfirmationEmail(params);

  const resendApiKey = process.env.RESEND_API_KEY;
  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  const brevoApiKey = process.env.BREVO_API_KEY;
  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;

  const defaultFrom = process.env.EMAIL_FROM || 'Stellaire Atelier <info@stellaireshop.com>';
  const replyTo = process.env.EMAIL_REPLY_TO || 'info@stellaireshop.com';

  // 1. Resend (Primary choice for Next.js / Vercel with high Primary Inbox deliverability)
  if (resendApiKey) {
    try {
      const sendPayload = async (fromAddress: string) => {
        return fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [params.customerEmail],
            reply_to: replyTo,
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
            headers: {
              'X-Entity-Ref-ID': params.orderId,
              'Auto-Submitted': 'auto-generated',
            },
            tags: [
              { name: 'category', value: 'order_confirmation' },
              { name: 'order_id', value: params.orderId },
            ],
          }),
        });
      };

      let res = await sendPayload(defaultFrom);
      let data = await res.json();

      // If custom domain is not yet verified in Resend dashboard, fall back to onboarding@resend.dev for test delivery
      if (!res.ok && data?.message && data.message.toLowerCase().includes('domain') && defaultFrom !== 'onboarding@resend.dev') {
        console.warn(`[Email] Domain not yet verified in Resend (${defaultFrom}). Retrying with test sender onboarding@resend.dev...`);
        res = await sendPayload('Stellaire <onboarding@resend.dev>');
        data = await res.json();
      }

      if (res.ok && data?.id) {
        sentOrderCache.set(cacheKey, now);
        console.log(`[Email] Resend dispatched successfully for ${params.orderId}. Message ID: ${data.id}`);
        return { success: true, provider: 'resend', messageId: data.id };
      } else {
        console.error(`[Email] Resend API error for ${params.orderId}:`, data);
        return { success: false, provider: 'resend', error: data?.message || JSON.stringify(data) };
      }
    } catch (err: any) {
      console.error(`[Email] Resend fetch exception:`, err);
      return { success: false, provider: 'resend', error: err.message };
    }
  }

  // 2. SendGrid
  if (sendgridApiKey) {
    try {
      const fromMatch = defaultFrom.match(/(.*)<(.*)>/) || [null, 'Stellaire Atelier', defaultFrom];
      const fromName = fromMatch[1]?.trim() || 'Stellaire Atelier';
      const fromEmail = fromMatch[2]?.trim() || defaultFrom;

      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: params.customerEmail, name: params.customerName || undefined }],
              custom_args: { order_id: params.orderId },
            },
          ],
          from: { email: fromEmail, name: fromName },
          reply_to: { email: replyTo, name: 'Stellaire Atelier' },
          subject: emailContent.subject,
          content: [
            { type: 'text/plain', value: emailContent.text },
            { type: 'text/html', value: emailContent.html },
          ],
        }),
      });

      if (res.ok || res.status === 202) {
        sentOrderCache.set(cacheKey, now);
        const msgId = res.headers.get('x-message-id') || `sg_${Date.now()}`;
        console.log(`[Email] SendGrid dispatched successfully for ${params.orderId}. Message ID: ${msgId}`);
        return { success: true, provider: 'sendgrid', messageId: msgId };
      } else {
        const errorText = await res.text();
        console.error(`[Email] SendGrid API error for ${params.orderId}:`, errorText);
        return { success: false, provider: 'sendgrid', error: errorText };
      }
    } catch (err: any) {
      console.error(`[Email] SendGrid fetch exception:`, err);
      return { success: false, provider: 'sendgrid', error: err.message };
    }
  }

  // 3. Brevo (Sendinblue)
  if (brevoApiKey) {
    try {
      const fromMatch = defaultFrom.match(/(.*)<(.*)>/) || [null, 'Stellaire Atelier', defaultFrom];
      const fromName = fromMatch[1]?.trim() || 'Stellaire Atelier';
      const fromEmail = fromMatch[2]?.trim() || defaultFrom;

      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: fromName, email: fromEmail },
          to: [{ email: params.customerEmail, name: params.customerName }],
          replyTo: { email: replyTo, name: 'Stellaire Atelier' },
          subject: emailContent.subject,
          htmlContent: emailContent.html,
          textContent: emailContent.text,
          tags: ['order_confirmation', params.orderId],
        }),
      });

      const data = await res.json();
      if (res.ok && data?.messageId) {
        sentOrderCache.set(cacheKey, now);
        console.log(`[Email] Brevo dispatched successfully for ${params.orderId}. Message ID: ${data.messageId}`);
        return { success: true, provider: 'brevo', messageId: data.messageId };
      } else {
        console.error(`[Email] Brevo API error for ${params.orderId}:`, data);
        return { success: false, provider: 'brevo', error: data?.message || JSON.stringify(data) };
      }
    } catch (err: any) {
      console.error(`[Email] Brevo fetch exception:`, err);
      return { success: false, provider: 'brevo', error: err.message };
    }
  }

  // 4. Postmark
  if (postmarkToken) {
    try {
      const res = await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: {
          'X-Postmark-Server-Token': postmarkToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          From: defaultFrom,
          To: params.customerEmail,
          ReplyTo: replyTo,
          Subject: emailContent.subject,
          HtmlBody: emailContent.html,
          TextBody: emailContent.text,
          MessageStream: 'outbound',
          Tag: 'order-confirmation',
        }),
      });

      const data = await res.json();
      if (res.ok && data?.MessageID) {
        sentOrderCache.set(cacheKey, now);
        console.log(`[Email] Postmark dispatched successfully for ${params.orderId}. Message ID: ${data.MessageID}`);
        return { success: true, provider: 'postmark', messageId: data.MessageID };
      } else {
        console.error(`[Email] Postmark API error for ${params.orderId}:`, data);
        return { success: false, provider: 'postmark', error: data?.Message || JSON.stringify(data) };
      }
    } catch (err: any) {
      console.error(`[Email] Postmark fetch exception:`, err);
      return { success: false, provider: 'postmark', error: err.message };
    }
  }

  // 5. Development / No-key simulation mode
  // Allows testing and zero-crash checkout even before the user adds RESEND_API_KEY in Vercel
  sentOrderCache.set(cacheKey, now);
  console.log('─────────────────────────────────────────────────────────────────');
  console.log(`📨 [SIMULATED EMAIL DISPATCH] (No provider API key configured yet)`);
  console.log(`   To: ${params.customerEmail} (${params.customerName || 'Customer'})`);
  console.log(`   Subject: ${emailContent.subject}`);
  console.log(`   Order: ${params.orderId} | Edition: ${params.frameStyle}`);
  if (params.frameStyle === 'digital') {
    console.log(`   Digital Download Link: ${params.origin || 'https://stellaireshop.com'}/api/orders/${params.orderId}/pdf`);
  } else {
    console.log(`   Carrier: ${params.carrier || 'PostNL'} | Tracking: ${params.trackingNumber || 'Pending'}`);
  }
  console.log('   Add RESEND_API_KEY in Vercel Environment Variables for real inbox delivery.');
  console.log('─────────────────────────────────────────────────────────────────');

  return {
    success: true,
    provider: 'simulated',
    simulated: true,
    messageId: `sim_${Date.now()}`,
  };
}
