/**
 * Resilient API fetcher that tries standard relative path (/api/...)
 * and falls back directly to the FastAPI server (http://127.0.0.1:8000/api/...)
 * if proxying fails or encounters sandbox restrictions.
 */
export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  try {
    const res = await fetch(cleanPath, init);
    if (res.ok) {
      return res;
    }
  } catch {
    // Network or proxy error, fallback to direct backend
  }

  // Fallback direct to FastAPI backend
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  return fetch(`${backendBase}${cleanPath}`, init);
}
