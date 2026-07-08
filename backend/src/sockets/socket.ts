import { Server as HttpServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JwtPayload } from '../types';

let io: SocketServer | null = null;

interface AuthedSocket extends Socket {
  userId?: string;
}

/**
 * One room per user (`user:<id>`), so a single emit reaches every device/tab
 * that user is logged in on — this is what makes multi-device sync "live"
 * instead of only updating on next manual refetch.
 */
export function initSocket(httpServer: HttpServer) {
  io = new SocketServer(httpServer, {
    cors: { origin: env.clientOrigin },
  });

  io.use((socket: AuthedSocket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;

    if (!token) {
      return next(new Error('Missing auth token'));
    }

    try {
      const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
      socket.userId = decoded.userId;
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket: AuthedSocket) => {
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    socket.on('disconnect', () => {
      // Room membership is cleaned up automatically by socket.io on disconnect.
    });
  });

  return io;
}

/**
 * Called from services after a successful write, to push the update to
 * every other connected device for that same user in real time.
 */
export function emitRecentlyViewedUpdate(userId: string, event: string, payload: unknown) {
  if (!io) return; // socket layer not initialized (e.g. during tests) — fail silently
  io.to(`user:${userId}`).emit(event, payload);
}
