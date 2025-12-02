import { SubmissionService } from './submission.service.js';
import { successResponse } from '../../utils/response.util.js';
import { MESSAGES } from '../../config/messages.js';

export const SubmissionController = {
  async create(req, res, next) {
    try {
      const submission = await SubmissionService.create(req.body);
      return successResponse(res, MESSAGES.SUBMISSION_CREATED, { submission }, 201);
    } catch (err) {
      return next(err);
    }
  },
  async list(req, res, next) {
    try {
      const { userId, scope, status } = req.query;

      if (scope === 'all') {
        const submissions = await SubmissionService.listAll(status);
        return successResponse(res, 'All submissions fetched successfully', { submissions });
      }

      if (!userId) {
        const err = new Error('userId query parameter is required unless scope=all');
        err.name = 'ValidationError';
        err.status = 400;
        throw err;
      }

      const submissions = await SubmissionService.listByUser(userId);
      return successResponse(res, 'Submissions fetched successfully', { submissions });
    } catch (err) {
      return next(err);
    }
  },
  async update(req, res, next) {
    try {
      const submission = await SubmissionService.update(req.params.id, req.body, req.user);
      return successResponse(res, MESSAGES.SUBMISSION_UPDATED, { submission });
    } catch (err) {
      return next(err);
    }
  },
};

