/**
 * Resilient API fetcher that sends requests directly to the live backend
 * (https://star-map-generator.onrender.com) when in production, avoiding
 * serverless timeouts or unconfigured environment variables.
 */
export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // Automatically detect if running in browser on localhost vs live cloud
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  const defaultBackend = isLocalhost
    ? 'http://127.0.0.1:8000'
    : 'https://star-map-generator.onrender.com';

  const remoteBackend = (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    defaultBackend
  ).replace(/\/$/, '');

  // In live production, fetch directly from Render backend
  if (remoteBackend && remoteBackend.startsWith('http') && !remoteBackend.includes('127.0.0.1')) {
    try {
      const res = await fetch(`${remoteBackend}${cleanPath}`, init);
      if (res.ok) {
        return res;
      }
    } catch (err) {
      console.warn(`Direct fetch to ${remoteBackend}${cleanPath} failed:`, err);
    }
  }

  // Relative path or local proxy
  try {
    const res = await fetch(cleanPath, init);
    if (res.ok) {
      return res;
    }
  } catch {
    // Network or proxy error
  }

  return fetch(`${remoteBackend}${cleanPath}`, init);
}
