import {Router} from 'express';
import {CategoryController} from './category.controller.js';
import {authenticate} from '../../middleware/auth.middleware.js';

const internalServerError = 500;
const router = Router();

// Route definition
router.get('/', authenticate, CategoryController.list);

export default router;
