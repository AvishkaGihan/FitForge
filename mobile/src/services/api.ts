import axios, { AxiosInstance, AxiosError } from 'axios';
import Constants from 'expo-constants';
import { storage } from '@/utils/storage';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async config => {
        const token = await storage.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          await storage.clearAuthToken();
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(email: string, password: string) {
    const { data } = await this.client.post('/auth/register', { email, password });
    return data;
  }

  async login(email: string, password: string) {
    const { data } = await this.client.post('/auth/login', { email, password });
    return data;
  }

  async logout() {
    const { data } = await this.client.post('/auth/logout');
    return data;
  }

  async getCurrentUser() {
    const { data } = await this.client.get('/auth/me');
    return data;
  }

  // User profile endpoints
  async getProfile() {
    const { data } = await this.client.get('/user/profile');
    return data;
  }

  async updateProfile(updates: Record<string, unknown>) {
    const { data } = await this.client.patch('/user/profile', updates);
    return data;
  }

  async getUserStats() {
    const { data } = await this.client.get('/user/stats');
    return data;
  }

  // Workout endpoints
  async generateWorkout() {
    const { data } = await this.client.post('/workouts/generate');
    return data;
  }

  async getLatestWorkout() {
    const { data } = await this.client.get('/workouts/latest');
    return data;
  }

  async getWorkout(id: string) {
    const { data } = await this.client.get(`/workouts/${id}`);
    return data;
  }

  async getUserWorkouts(limit = 10) {
    const { data } = await this.client.get('/workouts', { params: { limit } });
    return data;
  }

  async completeWorkout(id: string, completionData: Record<string, unknown>) {
    const { data } = await this.client.post(`/workouts/${id}/complete`, completionData);
    return data;
  }

  // Chat endpoints
  async sendChatMessage(message: string) {
    const { data } = await this.client.post('/chat/message', { message });
    return data;
  }

  async getChatMessages(limit = 50) {
    const { data } = await this.client.get('/chat/messages', { params: { limit } });
    return data;
  }

  // Exercise endpoints
  async getAllExercises() {
    const { data } = await this.client.get('/exercises');
    return data;
  }

  async searchExercises(filters: Record<string, unknown>) {
    const { data } = await this.client.get('/exercises/search', { params: filters });
    return data;
  }

  async getExercise(id: string) {
    const { data } = await this.client.get(`/exercises/${id}`);
    return data;
  }

  // Health check
  async healthCheck() {
    const { data } = await this.client.get('/health');
    return data;
  }
}

export const api = new ApiClient();
