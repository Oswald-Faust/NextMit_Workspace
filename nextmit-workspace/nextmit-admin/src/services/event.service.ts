import axios from 'axios';
import { Event } from '@/types/api';

const API_URL = 'http://localhost:5000/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('Token non trouvé');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  };
};

export const eventService = {
  async createEvent(formData: FormData): Promise<{ success: boolean; data: Event }> {
    try {
      const headers = getAuthHeaders();
      console.log('Headers envoyés:', headers); // Pour déboguer
      
      const response = await axios.post(`${API_URL}/events`, formData, {
        headers,
        withCredentials: true // Important pour les requêtes cross-origin
      });
      
      return response.data;
    } catch (error) {
      console.error('Erreur détaillée:', error.response?.data || error);
      throw error;
    }
  },

  async getEvents(): Promise<{ success: boolean; data: Event[] }> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/events`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  async getEvent(id: string): Promise<{ success: boolean; data: Event }> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/events/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  }
}; 