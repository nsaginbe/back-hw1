export interface User {
  id: number;
  email: string;
}

export interface CreateUserData {
  email: string;
  password: string;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
} 