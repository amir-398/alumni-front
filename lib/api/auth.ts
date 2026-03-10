import { fetchAPI } from "./client";

export interface Token {
  access_token: string;
  refresh_token?: string;
  token_type: string;
}

export interface UserResponse {
  id: number | string;
  email: string;
  is_active?: boolean;
  is_verified?: boolean;
  role: string;
  last_login?: string | null;
}

export const authApi = {
  login: async (username: string, password: string): Promise<Token> => {
    // Note: OAuth2 expects form-urlencoded
    const data = new URLSearchParams();
    data.append("username", username);
    data.append("password", password);

    return await fetchAPI<Token>("/api/v1/auth/login/access-token", {
      method: "POST",
      body: data.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },

  checkSetupRequired: async (): Promise<{ required: boolean }> => {
    return await fetchAPI<{ required: boolean }>("/api/v1/auth/setup-required", {
      method: "GET",
    });
  },

  setup: async (email: string, password: string, first_name?: string, last_name?: string): Promise<UserResponse> => {
    return await fetchAPI<UserResponse>("/api/v1/auth/setup", {
      method: "POST",
      body: JSON.stringify({ email, password, first_name, last_name }),
    });
  },

  getMe: async (): Promise<UserResponse> => {
    return await fetchAPI<UserResponse>("/api/v1/users/me", {
      method: "GET",
    });
  },

  logout: async (refresh_token: string): Promise<void> => {
    await fetchAPI("/api/v1/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refresh_token }),
    });
  },
};
