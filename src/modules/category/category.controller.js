import { CategoryModel } from './category.model.js';
import { successResponse } from '../../utils/response.util.js';
import { MESSAGES } from '../../config/messages.js';

export const CategoryController = {
  async list(req, res, next) {
    try {
      const categories = await CategoryModel.findAll();
      return successResponse(res, MESSAGES.CATEGORY_LIST_FETCHED, { categories });
    } catch (err) {
      return next(err);
    }
  },
};


