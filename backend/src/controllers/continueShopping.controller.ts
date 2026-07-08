import { Response } from 'express';
import { recentlyViewedService } from '../services/recentlyViewed.service';
import { sendSuccess } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../types';
import { ApiError } from '../utils/ApiError';

export const getContinueShopping = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.userId) throw ApiError.unauthorized();
  const items = await recentlyViewedService.getContinueShopping(req.userId);
  return sendSuccess(res, 200, 'Continue shopping list fetched', items);
});
