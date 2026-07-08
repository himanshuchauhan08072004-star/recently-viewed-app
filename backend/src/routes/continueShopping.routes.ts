import { Router } from 'express';
import { getContinueShopping } from '../controllers/continueShopping.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/', getContinueShopping);

export default router;
