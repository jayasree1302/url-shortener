const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong.');
  }

  return data;
}

export async function createShortUrl(originalUrl, customAlias = '') {
  const response = await fetch(`${API_URL}/api/urls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      originalUrl,
      customAlias: customAlias.trim() || undefined,
    }),
  });

  return handleResponse(response);
}

export async function fetchAllUrls() {
  const response = await fetch(`${API_URL}/api/urls`);
  return handleResponse(response);
}

export { API_URL };
