import { Router } from 'express';
import { TeamController } from './team.controller.js';

const router = Router();

router.get('/',TeamController.list);

export default router;

