import {RankService} from './rank.service.js';
import {successResponse} from '../../utils/response.util.js';
import {MESSAGES} from '../../config/messages.js';

export const RankController = {
  async list(req, res, next) {
    try {
      const {teamId, page = 1, size = 10, period, viewMode} = req.query;
      const offset = (page - 1) * size;
      const limit = parseInt(size);

      const {leaderboard, total} = await RankService.getLeaderboard({
        teamId,
        offset,
        limit,
        period,
        viewMode
      });
      const totalPages = Math.ceil(total / limit);

      return successResponse(res, MESSAGES.RANK_LIST_FETCHED, {
        leaderboard,
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
