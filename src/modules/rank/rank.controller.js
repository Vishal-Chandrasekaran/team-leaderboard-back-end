import { RankService } from './rank.service.js';
import { successResponse } from '../../utils/response.util.js';
import { MESSAGES } from '../../config/messages.js';

export const RankController = {
  async list(req, res, next) {
    try {
      const { teamId } = req.query;
      const leaderboard = await RankService.getLeaderboard({ teamId });
      return successResponse(res, MESSAGES.RANK_LIST_FETCHED, { leaderboard });
    } catch (err) {
      return next(err);
    }
  },
};
