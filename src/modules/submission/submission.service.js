import { SubmissionModel } from './submission.model.js';
import { UserModel } from '../user/user.model.js';

const STATUS_MAP = {
  Pending: 'Pending',
  'Approved - Bronze': 'Approved_Bronze',
  'Approved - Silver': 'Approved_Silver',
  'Approved - Gold': 'Approved_Gold',
  Rejected: 'Rejected',
};

const CATEGORY_MAP = {
  'Problem Solved (Knowledge Share)': 'Problem_Solved_Knowledge_Share',
  'Reusable Component Identified': 'Reusable_Component_Identified',
  'AI Workflow Enhancement': 'AI_Workflow_Enhancement',
  'Exceptional Code Review': 'Exceptional_Code_Review',
  'Mentorship Moment': 'Mentorship_Moment',
  'Documentation Hero': 'Documentation_Hero',
};

function normalizeEnum(value, map) {
  return map[value] ?? value;
}

export const SubmissionService = {
  async create(payload) {
    const { userId } = payload;
    const user = await UserModel.findById(userId);
    if (!user) {
      const err = new Error('User not found for provided userId');
      err.name = 'NotFoundError';
      err.status = 404;
      throw err;
    }

    const submission = await SubmissionModel.create({
      ...payload,
      status: normalizeEnum(payload.status, STATUS_MAP),
      category: normalizeEnum(payload.category, CATEGORY_MAP),
    });
    return submission;
  },
  async listByUser(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      const err = new Error('User not found for provided userId');
      err.name = 'NotFoundError';
      err.status = 404;
      throw err;
    }
    return SubmissionModel.findByUser(userId);
  },
  async listAll(statusFilter = 'Pending') {
    const normalizedStatus = statusFilter ? normalizeEnum(statusFilter, STATUS_MAP) : undefined;
    return SubmissionModel.findAll(normalizedStatus);
  },
  async update(submissionId, payload, actor) {
    if (actor?.role !== 'admin') {
      const err = new Error('Only admins can update submissions');
      err.name = 'ForbiddenError';
      err.status = 403;
      throw err;
    }

    const existing = await SubmissionModel.findById(submissionId);
    if (!existing) {
      const err = new Error('Submission not found');
      err.name = 'NotFoundError';
      err.status = 404;
      throw err;
    }

    const data = {};
    if (payload.status) {
      data.status = normalizeEnum(payload.status, STATUS_MAP);
    }
    if (Object.hasOwn(payload, 'adminFeedback')) {
      data.adminFeedback = payload.adminFeedback;
    }

    const updated = await SubmissionModel.update(submissionId, data);
    return updated;
  },
};

