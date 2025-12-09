import {CategoryModel} from './category.model.js';
import {successResponse} from '../../utils/response.util.js';
import {MESSAGES} from '../../config/messages.js';

export const CategoryController = {
  async list(req, res, next) {
    try {
      const {page = 1, size = 10} = req.query;
      const offset = (page - 1) * size;
      const limit = parseInt(size);

      const {categories, total} = await CategoryModel.findAll({offset, limit});

      const totalPages = Math.ceil(total / limit);

      return successResponse(res, MESSAGES.CATEGORY_LIST_FETCHED, {
        categories,
        meta: {
          totalCount: total,
          totalPages,
          page: parseInt(page),
          size: limit
        }
      });
    } catch (err) {
      return next(err);
    }
  }
};
