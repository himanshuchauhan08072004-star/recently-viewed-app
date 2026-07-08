import { useQuery } from '@tanstack/react-query';
import { recentlyViewedService } from '@/services/recentlyViewed.service';
import { useAuthStore } from '@/store/useAuthStore';

export function useContinueShopping() {
  const isGuest = useAuthStore((s) => s.isGuest);

  return useQuery({
    queryKey: ['continue-shopping'],
    queryFn: recentlyViewedService.getContinueShopping,
    enabled: !isGuest, // needs purchase history, so logged-in only
    staleTime: 60_000,
  });
}
