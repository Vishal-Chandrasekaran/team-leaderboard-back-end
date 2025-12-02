import { Router } from 'express';
import { SubmissionController } from './submission.controller.js';
import { submissionSchema, submissionUpdateSchema } from './submission.validation.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const err = new Error(error.details.map((d) => d.message).join(', '));
      err.name = 'ValidationError';
      err.status = 422;
      return next(err);
    }
    req.body = value;
    return next();
  };
}

router.post('/', authenticate, validate(submissionSchema), SubmissionController.create);
router.get('/', authenticate, SubmissionController.list);
router.patch('/:id', authenticate, validate(submissionUpdateSchema), SubmissionController.update);

export default router;

