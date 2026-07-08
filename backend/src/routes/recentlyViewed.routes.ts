import { Router } from 'express';
import {
  addRecentlyViewed,
  getRecentlyViewed,
  deleteRecentlyViewed,
  mergeHistory,
} from '../controllers/recentlyViewed.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  addViewedSchema,
  removeViewedSchema,
  mergeHistorySchema,
} from '../validations/recentlyViewed.validation';

const router = Router();

router.use(authMiddleware);

router.post('/', validate(addViewedSchema), addRecentlyViewed);
router.get('/', getRecentlyViewed);
router.delete('/:productId', validate(removeViewedSchema), deleteRecentlyViewed);
router.post('/merge', validate(mergeHistorySchema), mergeHistory);

export default router;
