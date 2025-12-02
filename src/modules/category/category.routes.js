import { Router } from 'express';
import { CategoryController } from './category.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate, CategoryController.list);

export default router;


