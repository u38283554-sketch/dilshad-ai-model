import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { chatRouter } from './server/api/chat';
import { filesRouter } from './server/api/files';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing middleware (supporting base64 images and documents)
  app.use(express.json({ limit: '30mb' }));
  app.use(express.urlencoded({ extended: true, limit: '30mb' }));

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Dilshad AI Assistant Server',
      provider: process.env.AI_PROVIDER || 'gemini',
      model: process.env.AI_MODEL || 'gemini-3.7-flash',
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes
  app.use('/api/chat', chatRouter);
  app.use('/api/files', filesRouter);

  // Vite Middleware / Static Serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Dilshad AI Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
