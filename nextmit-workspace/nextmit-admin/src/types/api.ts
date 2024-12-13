// Types de base
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}

// Types d'authentification
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

// Types utilisateur
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

// Types événement
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  capacity: number;
  price: number;
  imageUrl?: string;
  status: 'draft' | 'published' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Types ticket
export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  event?: Event;
  user?: User;
}

// Types statistiques
export interface DashboardStats {
  totalEvents: number;
  liveEvents: number;
  upcomingEvents: number;
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  revenueData: ChartData[];
  userActivityData: ChartData[];
  eventTypeStats: EventTypeStats[];
}

export interface ChartData {
  date: string;
  value: number;
}

export interface EventTypeStats {
  type: string;
  count: number;
  revenue: number;
  percentageTotal: number;
}

// Types pour les filtres
export interface EventFilters {
  search?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// Types pour les réponses paginées
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Types pour les statistiques d'événement
export interface EventStats {
  totalTickets: number;
  soldTickets: number;
  revenue: number;
  averagePrice: number;
  popularDays: Array<{
    date: string;
    count: number;
  }>;
}

// Types pour les statistiques utilisateur
export interface UserStats {
  totalEvents: number;
  totalTickets: number;
  totalSpent: number;
  lastLogin?: string;
  favoriteEventTypes: Array<{
    type: string;
    count: number;
  }>;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: ApiError;
}