import { create } from 'zustand';
import { RecentlyViewedItem, Product } from '@/types';
import { MAX_RECENTLY_VIEWED } from '@/constants/config';

interface RecentlyViewedState {
  items: RecentlyViewedItem[];
  isLoading: boolean;
  error: string | null;
  setItems: (items: RecentlyViewedItem[]) => void;
  addItemOptimistic: (product: Product, userId: string) => void;
  removeItem: (productId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  setItems: (items) => set({ items, error: null }),

  /**
   * Local-first update: move product to top / insert / dedupe / cap at 20.
   * Mirrors backend logic so the UI reacts instantly, before the server
   * mutation resolves. React Query's onSuccess will reconcile with the
   * authoritative server list afterward.
   */
  addItemOptimistic: (product, userId) =>
    set((state) => {
      const withoutDup = state.items.filter(
        (item) => item.productId._id !== product._id
      );

      const newItem: RecentlyViewedItem = {
        _id: `optimistic-${product._id}`,
        productId: product,
        userId,
        viewedAt: new Date().toISOString(),
      };

      return {
        items: [newItem, ...withoutDup].slice(0, MAX_RECENTLY_VIEWED),
      };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.productId._id !== productId),
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clear: () => set({ items: [], error: null }),
}));
