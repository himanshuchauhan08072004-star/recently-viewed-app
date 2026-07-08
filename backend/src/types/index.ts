import { Request } from 'express';
import { Types } from 'mongoose';

export interface JwtPayload {
  userId: string;
}

export interface AuthRequest extends Request {
  userId?: string;
}

export interface GuestViewedItem {
  productId: string;
  viewedAt: string; // ISO date string from client
}

export interface RecentlyViewedDTO {
  _id: Types.ObjectId;
  productId: Types.ObjectId;
  viewedAt: Date;
}
