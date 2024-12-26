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
  private adminKey = 'is_admin';
  private static instance: AuthService;

  constructor() {
    // Initialiser les headers d'Axios au démarrage
    this.initializeAxiosHeaders();
  }

  private initializeAxiosHeaders() {
    const token = this.getToken();
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Ajouter un header spécial pour l'admin
      if (this.isAdmin()) {
        axios.defaults.headers.common['X-Admin-Access'] = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'admin-secret';
      }
    }
  }

  async login(credentials: LoginCredentials) {
    try {
      // Si c'est l'admin avec les credentials spécifiques
      if (credentials.email === 'faustfrank@icloud.com' && 
          credentials.password === 'writer55') {
        this.setAdminHeaders();
        const adminUser = {
          id: 'admin',
          email: credentials.email, 
          role: 'admin',
          name: 'Administrateur'
        };
        
        localStorage.setItem(this.userKey, JSON.stringify(adminUser));
        Cookies.set(this.adminKey, 'true', { expires: 365 });
        
        return adminUser;
      }

      // Pour les utilisateurs normaux, continuer avec le JWT
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Réponse de connexion invalide');
      }

      Cookies.set(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return user;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  }

  isAdmin(): boolean {
    return Cookies.get(this.adminKey) === 'true';
  }

  // Méthode pour récupérer les utilisateurs avec gestion admin
  async getUsers() {
    try {
      if (this.isAdmin()) {
        this.setAdminHeaders();
      }
      const response = await axios.get(`${API_URL}/admin/users`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    const token = Cookies.get(this.tokenKey);
    return !!token;
  }

  async logout(): Promise<void> {
    try {
      const token = Cookies.get(this.tokenKey);
      
      if (token) {
        await axios.post(`${API_URL}/auth/logout`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      // Nettoyage complet
      Cookies.remove(this.tokenKey);
      localStorage.removeItem(this.userKey);
      delete axios.defaults.headers.common['Authorization'];
      
      // Forcer la redirection vers login
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Nettoyage même en cas d'erreur
      Cookies.remove(this.tokenKey);
      localStorage.removeItem(this.userKey);
      delete axios.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
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

  private setAdminHeaders() {
    const credentials = 'faustfrank@icloud.com:writer55';
    const encodedCredentials = btoa(credentials);
    axios.defaults.headers.common['Authorization'] = `Basic ${encodedCredentials}`;
  }
}

export const authService = new AuthService(); 