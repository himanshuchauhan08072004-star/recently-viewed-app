import { io, Socket } from 'socket.io-client';
import { SOCKET_BASE_URL } from '@/constants/config';

let socket: Socket | null = null;

export const socketService = {
  connect(token: string): Socket {
    if (socket?.connected) return socket;

    socket = io(SOCKET_BASE_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on('connect_error', (err) => {
      // Real-time sync is a nice-to-have, not critical — log and let
      // the app keep working off the last fetched/cached data.
      console.warn('[socket] connection failed:', err.message);
    });

    return socket;
  },

  disconnect() {
    socket?.disconnect();
    socket = null;
  },

  getSocket(): Socket | null {
    return socket;
  },
};
