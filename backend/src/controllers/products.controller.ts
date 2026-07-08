import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { sendSuccess } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getAllProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await Product.find().sort({ createdAt: -1 });
  return sendSuccess(res, 200, 'Products fetched', products);
});
