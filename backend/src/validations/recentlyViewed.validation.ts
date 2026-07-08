import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const addViewedSchema = z.object({
  body: z.object({
    productId: z.string().regex(objectIdRegex, 'Invalid productId'),
  }),
});

export const removeViewedSchema = z.object({
  params: z.object({
    productId: z.string().regex(objectIdRegex, 'Invalid productId'),
  }),
});

export const mergeHistorySchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          productId: z.string().regex(objectIdRegex, 'Invalid productId'),
          viewedAt: z.string().datetime({ message: 'viewedAt must be ISO date string' }),
        })
      )
      .max(20, 'Cannot merge more than 20 items'),
  }),
});
