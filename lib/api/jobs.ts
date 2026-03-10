import { fetchAPI } from "./client";
import { type JobPosting } from "../mock-data";

export interface JobParams {
  limit?: number;
  offset?: number;
}

export interface JobListResponse {
  items: JobPosting[];
  total: number;
  limit: number;
  offset: number;
}

export const jobsApi = {
  getJobs: async (params?: JobParams): Promise<JobListResponse> => {
    return await fetchAPI<JobListResponse>("/api/v1/jobs/", {
      method: "GET",
      params: params as any,
    });
  },

  getMyJobs: async (params?: JobParams): Promise<JobListResponse> => {
    return await fetchAPI<JobListResponse>("/api/v1/jobs/me", {
      method: "GET",
      params: params as any,
    });
  },

  createJob: async (data: any) => {
    return await fetchAPI("/api/v1/jobs/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateJob: async (id: number | string, data: any) => {
    return await fetchAPI(`/api/v1/jobs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteJob: async (id: number | string) => {
    return await fetchAPI(`/api/v1/jobs/${id}`, {
      method: "DELETE",
    });
  },
};
