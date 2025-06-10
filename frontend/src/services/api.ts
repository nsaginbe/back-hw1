import axios from 'axios';
import type { User, CreateUserData, UpdateUserData } from '../types/user';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// Add request interceptor for logging
api.interceptors.request.use(request => {
  console.log('Starting Request:', request);
  return request;
});

// Add response interceptor for logging
api.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

export const userApi = {
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get('/users/');
      console.log('Users data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getUser: async (id: number): Promise<User> => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  createUser: async (data: CreateUserData): Promise<User> => {
    try {
      const response = await api.post('/users/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  updateUser: async (id: number, data: UpdateUserData): Promise<User> => {
    try {
      const response = await api.patch(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },

  deleteUser: async (id: number): Promise<User> => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  },
}; 