import { Router } from 'express';
import { TeamController } from './team.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate, TeamController.list);

export default router;

