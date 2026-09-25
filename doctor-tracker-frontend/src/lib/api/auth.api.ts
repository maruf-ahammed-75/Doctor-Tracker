import axiosClient from "./axiosClient";
import { ApiResponse } from "@/types/api";
import { User, LoginCredentials, AuthResponseData } from "@/types/auth";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponseData> => {
    const response = await axiosClient.post<ApiResponse<AuthResponseData>>(
      "/auth/login",
      credentials
    );
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await axiosClient.post<ApiResponse<null>>("/auth/logout");
  },

  getMe: async (): Promise<User> => {
    const response = await axiosClient.get<ApiResponse<User>>("/auth/me");
    return response.data.data;
  },
};

export default authApi;
