import bcrypt from 'bcrypt';
import {UserModel} from '../user/user.model.js';
import { generateToken, verifyToken } from '../../utils/jwt.util.js';
import { sendResetPasswordEmail } from '../../utils/email.js';

const SALT_ROUNDS = 10;
export const AuthService = {
  async signup({name, email, password, avatar, teamId}) {
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      const err = new Error('User already exists');
      err.name = 'ConflictError';
      err.status = 409;
      throw err;
    }
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const userData = {
      name,
      email,
      password: hashed,
      ...(avatar && {avatar}),
      ...(teamId && {teamId})
    };

    const user = await UserModel.create(userData);
    // eslint-disable-next-line no-unused-vars
    const {password: _, ...safeUser} = user;
    return safeUser;
  },

  async signin({email, password}) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      const err = new Error('Invalid email or password');
      err.name = 'AuthError';
      err.status = 401;
      throw err;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      const err = new Error('Invalid email or password');
      err.name = 'AuthError';
      err.status = 401;
      throw err;
    }
    // eslint-disable-next-line no-unused-vars
    const {password: _, ...safeUser} = user;
    return safeUser;
  },

  async logout() {
    // In a stateless JWT setup with cookies, "logout" is primarily client-side (clearing cookie).
    // If we had a refresh token in DB, we would delete it here.
    return true;
  },

  async forgotPassword(email) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      const err = new Error('User not found');
      err.name = 'NotFoundError'; 
      err.status = 404;
      throw err;
    }
    // Generate reset token with 1 hour expiry
    const resetToken = generateToken({ id: user.id }, { expiresIn: '1h' });
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    
    await UserModel.update(user.id, { 
      resetToken, 
      resetTokenExpiry 
    });
    
    // Send reset password email
    await sendResetPasswordEmail(email, resetToken);
    
    const { password: _p, resetToken: _rt, resetTokenExpiry: _rte, ...safeUser } = user;
    return safeUser;
  },
  async resetPassword(password, token) {
    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      const error = new Error('Invalid or expired token');
      error.name = 'AuthError';
      error.status = 401;
      throw error;
    }
    
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      const err = new Error('User not found');
      err.name = 'NotFoundError';
      err.status = 404;
      throw err;
    }
    
    // Check if token matches and hasn't expired
    if (user.resetToken !== token) {
      const err = new Error('Invalid reset token');
      err.name = 'AuthError';
      err.status = 401;
      throw err;
    }
    
    if (!user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
      const err = new Error('Reset token has expired');
      err.name = 'AuthError';
      err.status = 401;
      throw err;
    }
    
    // Hash new password and update user
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    await UserModel.update(user.id, { 
      password: hashed,
      resetToken: null,
      resetTokenExpiry: null
    });
    
    const { password: _p, resetToken: _rt, resetTokenExpiry: _rte, ...safeUser } = user;
    return safeUser;
  }

};
