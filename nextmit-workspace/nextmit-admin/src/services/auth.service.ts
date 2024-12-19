import axios from 'axios';
import { API_URL } from '@/config';
import Cookies from 'js-cookie';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'user_data';

  async login(credentials: LoginCredentials) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Réponse de connexion invalide');
      }
      
      // Utiliser les cookies au lieu du localStorage
      Cookies.set(this.tokenKey, token, { expires: 7 }); // expire dans 7 jours
      localStorage.setItem(this.userKey, JSON.stringify(user));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return user;
    } catch (error: any) {
      console.error('Erreur de connexion:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Échec de la connexion');
    }
  }

  isAuthenticated(): boolean {
    const token = Cookies.get(this.tokenKey);
    return !!token;
  }

  logout() {
    Cookies.remove(this.tokenKey);
    localStorage.removeItem(this.userKey);
    delete axios.defaults.headers.common['Authorization'];
  }

  getToken(): string | null {
    return Cookies.get(this.tokenKey) || null;
  }

  getUser(): User | null {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  async getCurrentUser() {
    try {
      const token = this.getToken();
      if (!token) return null;

      const response = await fetch(`${API_URL}/admin/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch user');

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }

  async updateProfile(profileData: any) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('No token found');

      const response = await fetch(`${API_URL}/admin/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      return data.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
}

export const authService = new AuthService(); 