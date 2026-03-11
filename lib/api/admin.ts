import { fetchAPI } from "./client";

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export const adminApi = {
  // --- ALUMNI ---
  getAlumni: async (params?: PaginationParams) => {
    return await fetchAPI("/api/v1/admin/alumni/", {
      method: "GET",
      params: params as any,
    });
  },

  createAlumni: async (data: any) => {
    return await fetchAPI("/api/v1/admin/alumni/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateAlumni: async (id: string | number, data: any) => {
    return await fetchAPI(`/api/v1/admin/alumni/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deactivateAlumni: async (id: string | number) => {
    return await fetchAPI(`/api/v1/admin/alumni/${id}`, {
      method: "DELETE",
    });
  },

  scrapeAlumni: async (id: string | number) => {
    return await fetchAPI(`/api/v1/admin/alumni/${id}/scrape`, {
      method: "POST",
    });
  },

  scrapeAllAlumni: async () => {
    return await fetchAPI("/api/v1/admin/alumni/scrape-all", {
      method: "POST",
    });
  },

  linkedinAuth: async () => {
    return await fetchAPI("/api/v1/admin/alumni/linkedin-auth", {
      method: "POST",
    });
  },

  // --- JOBS ---
  getJobs: async (params?: PaginationParams) => {
    return await fetchAPI("/api/v1/admin/jobs/", {
      method: "GET",
      params: params as any,
    });
  },

  moderateJob: async (id: string | number, status: "APPROVED" | "REJECTED") => {
    return await fetchAPI(`/api/v1/admin/jobs/${id}/moderate`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  // --- EVENTS ---
  createEvent: async (data: any) => {
    return await fetchAPI("/api/v1/admin/events/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateEvent: async (id: string | number, data: any) => {
    return await fetchAPI(`/api/v1/admin/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteEvent: async (id: string | number) => {
    return await fetchAPI(`/api/v1/admin/events/${id}`, {
      method: "DELETE",
    });
  },

  getEventParticipants: async (id: string | number) => {
    return await fetchAPI(`/api/v1/admin/events/${id}/participants`, {
      method: "GET",
    });
  },

  // --- ENRICHMENT ---
  triggerEnrichment: async (alumniId: string | number) => {
    return await fetchAPI(
      `/api/v1/admin/enrichment/alumni/${alumniId}/trigger`,
      {
        method: "POST",
      },
    );
  },

  runDueScrapes: async () => {
    return await fetchAPI("/api/v1/admin/enrichment/run-due", {
      method: "POST",
    });
  },

  // --- AUDIT LOGS ---
  getAuditLogs: async (params?: PaginationParams) => {
    return await fetchAPI("/api/v1/admin/audit-logs/", {
      method: "GET",
      params: params as any,
    });
  },

  // --- CORRECTIONS ---
  getCorrections: async (
    params?: PaginationParams & { status?: string | null },
  ) => {
    return await fetchAPI("/api/v1/admin/corrections/", {
      method: "GET",
      params: params as any,
    });
  },

  approveCorrection: async (id: string | number) => {
    return await fetchAPI(`/api/v1/admin/corrections/${id}/approve`, {
      method: "PATCH",
    });
  },

  rejectCorrection: async (id: string | number) => {
    return await fetchAPI(`/api/v1/admin/corrections/${id}/reject`, {
      method: "PATCH",
    });
  },
};
