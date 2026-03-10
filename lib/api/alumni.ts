import { fetchAPI } from "./client";
import { type Alumni } from "../mock-data";

export interface DirectoryParams {
  q?: string | null;
  graduation_year?: number | null;
  diploma?: string | null;
  limit?: number;
  offset?: number;
}

export interface DirectoryResponse {
  items: Alumni[];
  total: number;
  limit: number;
  offset: number;
}

export const alumniApi = {
  getDirectory: async (
    params?: DirectoryParams,
  ): Promise<DirectoryResponse> => {
    return await fetchAPI<DirectoryResponse>("/api/v1/alumni/directory", {
      method: "GET",
      params: params as any,
    });
  },

  getMyProfile: async () => {
    return await fetchAPI("/api/v1/alumni/me/profile", {
      method: "GET",
    });
  },

  updateMyProfile: async (data: any) => {
    return await fetchAPI("/api/v1/alumni/me/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  createCorrection: async (data: any) => {
    return await fetchAPI("/api/v1/alumni/me/corrections", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
