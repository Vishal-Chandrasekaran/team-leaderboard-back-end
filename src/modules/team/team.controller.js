import {TeamModel} from './team.model.js';
import {successResponse} from '../../utils/response.util.js';
import {MESSAGES} from '../../config/messages.js';

export const TeamController = {
  async list(req, res, next) {
    try {
      const {page = 1, size = 10} = req.query;
      const offset = (page - 1) * size;
      const limit = parseInt(size);

      const {teams, total} = await TeamModel.findAll({offset, limit});
      const totalPages = Math.ceil(total / limit);

      return successResponse(res, MESSAGES.TEAM_LIST_FETCHED, {
        teams,
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
