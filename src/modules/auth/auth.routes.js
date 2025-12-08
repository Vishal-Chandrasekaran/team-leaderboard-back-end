import {Router} from 'express';
import {AuthController} from './auth.controller.js';
import {authenticate} from '../../middleware/auth.middleware.js';
import {signinSchema, signupSchema} from './auth.validation.js';

const router = Router();

function validate(schema) {
  return (req, res, next) => {
    // Merge query parameters into body for validation (query params take precedence)
    const dataToValidate = {...req.body, ...req.query};
    const {error} = schema.validate(dataToValidate, {abortEarly: false});
    if (error) {
      const err = new Error(error.details.map((d) => d.message).join(', '));
      err.name = 'ValidationError';
      err.status = 422;
      return next(err);
    }
    // Update req.body with merged data for controller use
    req.body = dataToValidate;
    return next();
  };
}
router.post('/signup', validate(signupSchema), AuthController.signup);
router.post('/signin', validate(signinSchema), AuthController.signin);
router.post('/logout', AuthController.logout);
router.get('/profile', authenticate, AuthController.profile);

export default router;
