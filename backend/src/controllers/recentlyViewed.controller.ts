import { Response } from 'express';
import { recentlyViewedService } from '../services/recentlyViewed.service';
import { sendSuccess } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../types';
import { ApiError } from '../utils/ApiError';

export const addRecentlyViewed = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.userId) throw ApiError.unauthorized();
  const { productId } = req.body;
  const item = await recentlyViewedService.addView(req.userId, productId);
  return sendSuccess(res, 201, 'Product view recorded', item);
});

export const getRecentlyViewed = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.userId) throw ApiError.unauthorized();
  const items = await recentlyViewedService.getHistory(req.userId);
  return sendSuccess(res, 200, 'Recently viewed fetched', items);
});

export const deleteRecentlyViewed = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.userId) throw ApiError.unauthorized();
  const { productId } = req.params;
  await recentlyViewedService.removeView(req.userId, productId);
  return sendSuccess(res, 200, 'Removed from history');
});

export const mergeHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.userId) throw ApiError.unauthorized();
  const { items } = req.body;
  const merged = await recentlyViewedService.mergeGuestHistory(req.userId, items);
  return sendSuccess(res, 200, 'History merged', merged);
});
