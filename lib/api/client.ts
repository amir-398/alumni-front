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
    const method = config.method || "GET";
    let body = null;
    try {
      body = config.body ? JSON.parse(config.body as string) : null;
    } catch (e) {
      body = config.body; // Keep as string if not JSON
    }
    
    console.log(`[API Request] ${method} ${url.toString()}`, body ? { body } : "");
    
    let response = await fetch(url.toString(), config);
    console.log(`[API Response] ${response.status} for ${endpoint}`);

    // If 401 Unauthorized, try to refresh token
    if (response.status === 401 && typeof window !== "undefined" && !endpoint.includes("/auth/")) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        console.log("[API] Attempting token refresh...");
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/api/v1/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            console.log("[API] Token refresh successful");
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);

            // Retry original request with new token
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${data.access_token}`,
            };
            response = await fetch(url.toString(), config);
          } else {
            console.warn("[API] Token refresh failed, redirecting to login");
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/";
          }
        } catch (refreshErr) {
          console.error("[API] Token refresh exception:", refreshErr);
        }
      }
    }

    // Check if network error or HTTP error
    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      console.error(`[API Error] ${response.status} ${endpoint}`, errorBody);
      
      const errorMessage = errorBody?.detail 
        ? (typeof errorBody.detail === "string" ? errorBody.detail : JSON.stringify(errorBody.detail))
        : `API Error: ${response.status}`;
        
      throw new Error(errorMessage);
    }

    // For 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error(`[API Exception] ${endpoint}:`, error);
    throw error;
  }
}
