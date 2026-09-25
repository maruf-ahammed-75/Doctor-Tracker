export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: "admin";
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
}
