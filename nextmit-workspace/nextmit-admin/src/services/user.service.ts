import { API_URL } from '@/config';
import { User, ApiResponse, UserFilters } from '@/types/api';

export const userService = {
  async getUsers(filters?: UserFilters): Promise<ApiResponse<{ items: User[] }>> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }

    const response = await fetch(`${API_URL}/users?${queryParams}`);
    return response.json();
  },

  async getUser(id: string): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_URL}/users/${id}`);
    return response.json();
  },

  async updateUser(id: string, data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  async getUserStats(id: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_URL}/users/${id}/stats`);
    return response.json();
  },
}; 