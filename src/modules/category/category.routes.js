import { Router } from 'express';
import { CategoryController } from './category.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const internalServerError = 500;
const router = Router();

router.get('/', authenticate, async (req, res) => {
  const { page = 1, size = 5 } = req.query;

  try {
    // Fetch data with pagination
    const categories = await CategoryController.list({
      offset: (page - 1) * size,
      limit: size,
    });

    // Return the paginated data
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(internalServerError).json({ error: 'Failed to fetch categories' });
  }
});

export default router;


