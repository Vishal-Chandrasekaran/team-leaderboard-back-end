import bcrypt from 'bcrypt';
import {UserModel} from '../user/user.model.js';

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
  }
};
