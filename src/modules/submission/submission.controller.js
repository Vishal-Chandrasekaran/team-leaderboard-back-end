import {SubmissionService} from './submission.service.js';
import {successResponse} from '../../utils/response.util.js';
import {MESSAGES} from '../../config/messages.js';

export const SubmissionController = {
  async create(req, res, next) {
    try {
      const submission = await SubmissionService.create(req.body);
      return successResponse(
        res,
        MESSAGES.SUBMISSION_CREATED,
        {submission},
        201
      );
    } catch (err) {
      return next(err);
    }
  },
  async list(req, res, next) {
    try {
      const {userId, scope, status, page = 1, size = 10} = req.query;
      const offset = (page - 1) * size;
      const limit = parseInt(size);

      if (scope === 'all') {
        const {submissions, total} = await SubmissionService.listAll(status, {
          offset,
          limit
        });
        const totalPages = Math.ceil(total / limit);
        return successResponse(res, 'All submissions fetched successfully', {
          submissions,
          meta: {
            totalCount: total,
            totalPages,
            page: parseInt(page),
            size: limit
          }
        });
      }

      if (!userId) {
        const err = new Error(
          'userId query parameter is required unless scope=all'
        );
        err.name = 'ValidationError';
        err.status = 400;
        throw err;
      }

      const {submissions, total} = await SubmissionService.listByUser(userId, {
        offset,
        limit
      });
      const totalPages = Math.ceil(total / limit);
      return successResponse(res, 'Submissions fetched successfully', {
        submissions,
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
  },
  async update(req, res, next) {
    try {
      const submission = await SubmissionService.update(
        req.params.id,
        req.body,
        req.user
      );
      return successResponse(res, MESSAGES.SUBMISSION_UPDATED, {submission});
    } catch (err) {
      return next(err);
    }
  }
};
