import Joi from 'joi';

export const STATUS_VALUES = [
  'Pending',
  'Approved - Bronze',
  'Approved - Silver',
  'Approved - Gold',
  'Rejected',
];

export const CATEGORY_VALUES = [
  'Problem Solved (Knowledge Share)',
  'Reusable Component Identified',
  'AI Workflow Enhancement',
  'Exceptional Code Review',
  'Mentorship Moment',
  'Documentation Hero',
];

export const submissionSchema = Joi.object({
  title: Joi.string().max(255).optional(),
  description: Joi.string().allow('', null),
  status: Joi.string()
    .valid(...STATUS_VALUES)
    .default('Pending'),
  category: Joi.string()
    .valid(...CATEGORY_VALUES)
    .required(),
  evidenceLinks: Joi.array()
    .items(Joi.string().uri().trim())
    .min(1)
    .required(),
  userId: Joi.string().uuid().required(),
});

export const submissionUpdateSchema = Joi.object({
  status: Joi.string().valid(...STATUS_VALUES),
  adminFeedback: Joi.string().allow('', null),
})
  .or('status', 'adminFeedback')
  .prefs({
    messages: {
      'object.missing': 'At least one of status or adminFeedback is required',
    },
  });

