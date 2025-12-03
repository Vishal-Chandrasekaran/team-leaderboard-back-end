import { AuthService } from './auth.service.js';
import { MESSAGES } from '../../config/messages.js';
import { successResponse } from '../../utils/response.util.js';
import { generateToken, generateRefreshToken } from '../../utils/jwt.util.js';

export const AuthController = {
  async signup(req, res, next) {
    try {
      const user = await AuthService.signup(req.body);
      return successResponse(res, MESSAGES.USER_CREATED, { user }, 201);
    } catch (err) {
      return next(err);
    }
  },

  async signin(req, res, next) {
    try {
      const user = await AuthService.signin(req.body);
      const token = generateToken({ id: user.id });
      const refreshToken = generateRefreshToken({ id: user.id });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return successResponse(res, MESSAGES.LOGIN_SUCCESS, { token, refreshToken, user });
    } catch (err) {
      return next(err);
    }
  },

  async profile(req, res) {
    return successResponse(res, 'Profile fetched', { user: req.user });
  },
};
