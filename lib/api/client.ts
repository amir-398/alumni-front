const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ApiOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

// Helper to handle API fetch
export async function fetchAPI<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const { params, headers, ...customConfig } = options;

  // Build query string
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  console.log(`[API] Preparing request to: ${url.toString()}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // Handle headers & token
  const config: RequestInit = {
    ...customConfig,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  // Attempt to get token (only in browser environment)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  try {
    console.log(`[API] Executing fetch: ${url.toString()}`);
    let response = await fetch(url.toString(), config);
    console.log(`[API] Response received for ${endpoint}: Status ${response.status}`);

    // If 401 Unauthorized, try to refresh token
    if (response.status === 401 && typeof window !== "undefined" && !endpoint.includes("/auth/")) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/api/v1/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);

            // Retry original request with new token
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${data.access_token}`,
            };
            response = await fetch(url.toString(), config);
          } else {
            // Refresh failed, clear tokens
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/"; // Force redirect to login
          }
        } catch (refreshErr) {
          console.error("Token refresh failed:", refreshErr);
        }
      }
    }

    // Check if network error or HTTP error (e.g. 500)
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || `API Error: ${response.status}`);
    }

    // For 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    // We throw everything, the calling service will catch and fallback to mock data
    console.error(`Fetch API Error (${endpoint}):`, error);
    throw error;
  }
}
