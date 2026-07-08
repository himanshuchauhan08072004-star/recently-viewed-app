import { create } from 'zustand';
import { AuthUser } from '@/types';
import { socketService } from '@/services/socket.service';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isGuest: boolean;
  setSession: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isGuest: true,
  setSession: (token, user) => {
    set({ token, user, isGuest: false });
    // Real-time sync only makes sense once we have an identity to route
    // socket rooms by — connect right after login succeeds.
    socketService.connect(token);
  },
  logout: () => {
    socketService.disconnect();
    set({ token: null, user: null, isGuest: true });
  },
}));
