import { API_URL } from '@/config';
import { Event, ApiResponse, EventFilters, EventStats } from '@/types/api';

export const eventService = {
  async getEvents(filters?: EventFilters): Promise<ApiResponse<{ items: Event[] }>> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }

    const response = await fetch(`${API_URL}/events?${queryParams}`);
    return response.json();
  },

  async getEvent(id: string): Promise<ApiResponse<Event>> {
    const response = await fetch(`${API_URL}/events/${id}`);
    return response.json();
  },

  async createEvent(data: FormData): Promise<ApiResponse<Event>> {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      body: data,
    });
    return response.json();
  },

  async updateEvent(id: string, data: FormData): Promise<ApiResponse<Event>> {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      body: data,
    });
    return response.json();
  },

  async deleteEvent(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  async publishEvent(id: string): Promise<ApiResponse<Event>> {
    const response = await fetch(`${API_URL}/events/${id}/publish`, {
      method: 'POST',
    });
    return response.json();
  },

  async cancelEvent(id: string, reason: string): Promise<ApiResponse<Event>> {
    const response = await fetch(`${API_URL}/events/${id}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });
    return response.json();
  },

  async getEventStats(id: string): Promise<ApiResponse<EventStats>> {
    const response = await fetch(`${API_URL}/events/${id}/stats`);
    return response.json();
  },
}; 