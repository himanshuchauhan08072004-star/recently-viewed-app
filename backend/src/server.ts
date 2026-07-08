import http from 'http';
import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';
import { initSocket } from './sockets/socket';

async function bootstrap() {
  await connectDB();

  const httpServer = http.createServer(app);
  initSocket(httpServer);

  httpServer.listen(env.port, () => {
    console.log(`[SERVER] Running on port ${env.port} (${env.nodeEnv})`);
    console.log('[SOCKET] Real-time sync ready');
  });

  process.on('unhandledRejection', (err) => {
    console.error('[UNHANDLED REJECTION]', err);
    httpServer.close(() => process.exit(1));
  });
}

bootstrap();
