import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes.js';
import teamRoutes from './modules/team/team.routes.js';
import submissionRoutes from './modules/submission/submission.routes.js';
import rankRoutes from './modules/rank/rank.routes.js';
import categoryRoutes from './modules/category/category.routes.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';
import { prisma } from './config/db.js';
import imageRoutes from './modules/image/image.routes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database health check endpoint
app.get('/health/db', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/ranks', rankRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/image', imageRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
