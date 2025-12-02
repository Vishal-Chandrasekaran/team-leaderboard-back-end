import { TeamModel } from './team.model.js';
import { successResponse } from '../../utils/response.util.js';
import { MESSAGES } from '../../config/messages.js';

export const TeamController = {
  async list(req, res, next) {
    try {
      const teams = await TeamModel.findAll();
      return successResponse(res, MESSAGES.TEAM_LIST_FETCHED, { teams });
    } catch (err) {
      return next(err);
    }
  },
};

