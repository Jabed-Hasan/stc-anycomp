import { getValidToken, refreshAccessToken } from './tokenRefresh';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function fetchWithAuth(url: string, options: FetchOptions = {}): Promise<Response> {
  // Get valid token (will refresh if expired)
  const token = await getValidToken();

  if (!token) {
    throw new Error('No valid token available');
  }

  // Add authorization header
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  // Make the request
  let response = await fetch(url, {
    ...options,
    headers,
  });

  // If unauthorized, try to refresh token once
  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    
    if (newToken) {
      // Retry with new token
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
    } else {
      // Refresh failed, redirect to login
      window.location.href = '/login';
      throw new Error('Authentication failed');
    }
  }

  return response;
}
