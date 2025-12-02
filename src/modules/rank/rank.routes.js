import { Router } from 'express';
import { RankController } from './rank.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate, RankController.list);

export default router;

