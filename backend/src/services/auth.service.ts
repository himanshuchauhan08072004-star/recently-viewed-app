import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

function signToken(userId: string) {
  const options: jwt.SignOptions = {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign({ userId }, env.jwtSecret, options);
}

export const authService = {
  async register(name: string, email: string, password: string) {
    const existing = await User.findOne({ email });
    if (existing) {
      throw ApiError.conflict('Email already registered');
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user.id);
    return { user: { id: user.id, name: user.name, email: user.email }, token };
  },

  async login(email: string, password: string) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = signToken(user.id);
    return { user: { id: user.id, name: user.name, email: user.email }, token };
  },
};
