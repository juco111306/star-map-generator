/**
 * Resilient API fetcher that sends requests directly to the live backend
 * (e.g. Render) when configured, avoiding serverless timeout restrictions.
 */
export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const remoteBackend = (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    ''
  ).replace(/\/$/, '');

  // If live backend URL is configured (e.g. on Render), call it directly!
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

  const fallbackBase = remoteBackend || 'http://127.0.0.1:8000';
  return fetch(`${fallbackBase}${cleanPath}`, init);
}
