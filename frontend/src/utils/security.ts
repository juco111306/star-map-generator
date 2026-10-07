import crypto from 'crypto';

const SECRET_SALT = process.env.ORDER_SECURITY_SECRET || 'stellaire-atelier-celestial-token-salt-2026';

/**
 * Generates an unguessable 32-character HMAC token for secure PDF downloads.
 * Uses the server secret salt to cryptographically sign the order.
 */
export function generateDownloadToken(orderId: string, email: string = ''): string {
  const normalizedId = (orderId || '').trim();
  // Primary secure HMAC token derived from orderId and server secret salt
  return crypto
    .createHmac('sha256', SECRET_SALT)
    .update(`order_pdf_download:${normalizedId}`)
    .digest('hex')
    .slice(0, 32);
}

/**
 * Validates whether a provided download token matches the cryptographic HMAC for an order.
 * Accepts primary signature as well as email-bound signature for full backwards compatibility.
 */
export function verifyDownloadToken(orderId: string, email: string = '', token: string): boolean {
  if (!token || typeof token !== 'string') return false;

  const normalizedId = (orderId || '').trim();
  const normalizedEmail = (email || '').toLowerCase().trim();

  // 1. Primary order HMAC signature
  const expectedPrimary = crypto
    .createHmac('sha256', SECRET_SALT)
    .update(`order_pdf_download:${normalizedId}`)
    .digest('hex')
    .slice(0, 32);

  // 2. Email-bound HMAC signature (for legacy links or query params)
  const expectedWithEmail = crypto
    .createHmac('sha256', SECRET_SALT)
    .update(`${normalizedId}:${normalizedEmail}`)
    .digest('hex')
    .slice(0, 32);

  // 3. Unbound HMAC signature
  const expectedEmptyEmail = crypto
    .createHmac('sha256', SECRET_SALT)
    .update(`${normalizedId}:`)
    .digest('hex')
    .slice(0, 32);

  const safeCompare = (expected: string) => {
    if (token.length !== expected.length) return false;
    try {
      return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
    } catch {
      return false;
    }
  };

  return safeCompare(expectedPrimary) || safeCompare(expectedWithEmail) || safeCompare(expectedEmptyEmail);
}
