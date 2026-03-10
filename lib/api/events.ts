import { fetchAPI } from "./client";
import { type Event } from "../mock-data";

export interface EventParams {
  limit?: number;
  offset?: number;
}

export interface EventListResponse {
  items: Event[];
  total: number;
  limit: number;
  offset: number;
}

export const eventsApi = {
  getEvents: async (params?: EventParams): Promise<EventListResponse> => {
    return await fetchAPI<EventListResponse>("/api/v1/events/", {
      method: "GET",
      params: params as any,
    });
  },

  getEvent: async (id: number | string): Promise<Event> => {
    return await fetchAPI<Event>(`/api/v1/events/${id}`, {
      method: "GET",
    });
  },

  registerToEvent: async (id: number | string) => {
    return await fetchAPI(`/api/v1/events/${id}/register`, {
      method: "POST",
    });
  },
};
