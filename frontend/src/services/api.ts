import axios from 'axios';
import type { User, CreateUserData, UpdateUserData } from '../types/user';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url)
    console.log('Request method:', config.method)
    console.log('Request data:', config.data)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status)
    console.log('Response data:', response.data)
    return response
  },
  (error) => {
    console.error('Response error:', error)
    console.error('Error status:', error.response?.status)
    console.error('Error data:', error.response?.data)
    return Promise.reject(error)
  }
)

export const userApi = {
  getUsers: async (): Promise<User[]> => {
    console.log('Fetching users...')
    try {
      const response = await api.get<User[]>('/users')
      console.log('Users fetched successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
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