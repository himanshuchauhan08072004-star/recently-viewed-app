import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { recentlyViewedService } from '@/services/recentlyViewed.service';
import { storageService } from '@/services/storage.service';
import { socketService } from '@/services/socket.service';
import { useAuthStore } from '@/store/useAuthStore';
import { useRecentlyViewedStore } from '@/store/useRecentlyViewedStore';
import { Product, RecentlyViewedItem } from '@/types';

const QUERY_KEY = ['recently-viewed'];

export function useRecentlyViewed() {
  const isGuest = useAuthStore((s) => s.isGuest);
  const setItems = useRecentlyViewedStore((s) => s.setItems);
  const items = useRecentlyViewedStore((s) => s.items);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: recentlyViewedService.getHistory,
    enabled: !isGuest, // guests read from AsyncStorage, not server
    staleTime: 60_000, // avoid refetching on every screen focus
  });

  // React Query v5 removed onSuccess from useQuery — sync to Zustand here instead.
  useEffect(() => {
    if (query.data) setItems(query.data);
  }, [query.data, setItems]);

  // Real-time: when ANY device for this user adds/removes a view, the server
  // pushes the fresh list over the socket. We write it straight into the
  // query cache — no refetch needed — so every screen updates within ~1s.
  useEffect(() => {
    if (isGuest) return;
    const socket = socketService.getSocket();
    if (!socket) return;

    const handleUpdate = (updated: RecentlyViewedItem[]) => {
      queryClient.setQueryData(QUERY_KEY, updated);
      setItems(updated);
    };

    socket.on('recently-viewed:updated', handleUpdate);
    return () => {
      socket.off('recently-viewed:updated', handleUpdate);
    };
  }, [isGuest, queryClient, setItems]);

  return { ...query, items: isGuest ? [] : items };
}

export function useAddRecentlyViewed() {
  const queryClient = useQueryClient();
  const isGuest = useAuthStore((s) => s.isGuest);
  const userId = useAuthStore((s) => s.user?.id ?? 'guest');
  const addItemOptimistic = useRecentlyViewedStore((s) => s.addItemOptimistic);

  return useMutation({
    mutationFn: async (product: Product) => {
      if (isGuest) {
        return storageService.addToGuestHistory(product._id);
      }
      return recentlyViewedService.addView(product._id);
    },
    onMutate: async (product: Product) => {
      // Optimistic UI update, logged-in only (guest store isn't used for display state).
      if (!isGuest) addItemOptimistic(product, userId);
    },
    onSuccess: () => {
      if (!isGuest) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      }
    },
  });
}

export function useRemoveRecentlyViewed() {
  const queryClient = useQueryClient();
  const removeItem = useRecentlyViewedStore((s) => s.removeItem);

  return useMutation({
    mutationFn: (productId: string) => recentlyViewedService.removeView(productId),
    onMutate: (productId: string) => removeItem(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
