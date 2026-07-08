import { axiosClient } from '@/api/axiosClient';
import { ENDPOINTS } from '@/api/endpoints';
import { ApiResponse, AuthUser } from '@/types';

interface AuthResult {
  user: AuthUser;
  token: string;
}

export const authService = {
  async register(name: string, email: string, password: string) {
    const { data } = await axiosClient.post<ApiResponse<AuthResult>>(
      ENDPOINTS.AUTH.REGISTER,
      { name, email, password }
    );
    return data.data;
  },

  async login(email: string, password: string) {
    const { data } = await axiosClient.post<ApiResponse<AuthResult>>(
      ENDPOINTS.AUTH.LOGIN,
      { email, password }
    );
    return data.data;
  },
};
