// Token refresh utility
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

export async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token: string) => {
        resolve(token);
      });
    });
  }

  isRefreshing = true;

  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('https://stc-supabase.vercel.app/api/v1/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (data.success && data.data.accessToken) {
      const newToken = data.data.accessToken;
      localStorage.setItem('accessToken', newToken);
      
      if (data.data.refreshToken) {
        localStorage.setItem('refreshToken', data.data.refreshToken);
      }

      onTokenRefreshed(newToken);
      isRefreshing = false;
      return newToken;
    } else {
      throw new Error('Token refresh failed');
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    isRefreshing = false;
    // Clear all auth data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    // Redirect to login
    window.location.href = '/login';
    return null;
  }
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    
    // Log for debugging
    console.log('Token expiration check:', {
      expiresAt: new Date(exp).toLocaleString(),
      currentTime: new Date(now).toLocaleString(),
      timeRemaining: Math.floor((exp - now) / 1000 / 60) + ' minutes',
      isExpired: now >= exp
    });
    
    return now >= exp;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
}

// Check if token is about to expire (within 5 minutes)
export function isTokenExpiringSoon(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() >= (exp - fiveMinutes);
  } catch (error) {
    return true;
  }
}

// Get valid token (refresh if needed)
export async function getValidToken(): Promise<string | null> {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    return await refreshAccessToken();
  }

  if (isTokenExpiringSoon(token)) {
    // Refresh in background
    refreshAccessToken().catch(() => {});
  }

  return token;
}
