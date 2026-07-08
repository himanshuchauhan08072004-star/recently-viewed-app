import { axiosClient } from '@/api/axiosClient';
import { ENDPOINTS } from '@/api/endpoints';
import { ApiResponse, RecentlyViewedItem, GuestViewedItem } from '@/types';

export const recentlyViewedService = {
  async addView(productId: string) {
    const { data } = await axiosClient.post<ApiResponse<RecentlyViewedItem>>(
      ENDPOINTS.RECENTLY_VIEWED.BASE,
      { productId }
    );
    return data.data;
  },

  async getHistory() {
    const { data } = await axiosClient.get<ApiResponse<RecentlyViewedItem[]>>(
      ENDPOINTS.RECENTLY_VIEWED.BASE
    );
    return data.data;
  },

  async removeView(productId: string) {
    await axiosClient.delete(ENDPOINTS.RECENTLY_VIEWED.REMOVE(productId));
  },

  async mergeHistory(items: GuestViewedItem[]) {
    const { data } = await axiosClient.post<ApiResponse<RecentlyViewedItem[]>>(
      ENDPOINTS.RECENTLY_VIEWED.MERGE,
      { items }
    );
    return data.data;
  },

  async getContinueShopping() {
    const { data } = await axiosClient.get<ApiResponse<RecentlyViewedItem[]>>(
      ENDPOINTS.CONTINUE_SHOPPING
    );
    return data.data;
  },
};
