import { axiosClient } from '@/api/axiosClient';
import { ApiResponse, Product } from '@/types';

export const productsService = {
  async getAll() {
    const { data } = await axiosClient.get<ApiResponse<Product[]>>('/products');
    return data.data;
  },
};
