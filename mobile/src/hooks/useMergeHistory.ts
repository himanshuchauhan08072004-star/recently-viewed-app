import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recentlyViewedService } from '@/services/recentlyViewed.service';
import { storageService } from '@/services/storage.service';

/**
 * Call this once, right after a guest successfully logs in.
 * Reads whatever was saved locally, pushes it to the server merge endpoint,
 * then clears AsyncStorage so it's never merged twice.
 */
export function useMergeHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const guestItems = await storageService.getGuestHistory();
      if (guestItems.length === 0) return [];

      const merged = await recentlyViewedService.mergeHistory(guestItems);
      await storageService.clearGuestHistory();
      return merged;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recently-viewed'] });
    },
  });
}
