import { Router } from 'express';
import authRoutes from './auth.routes';
import recentlyViewedRoutes from './recentlyViewed.routes';
import continueShoppingRoutes from './continueShopping.routes';
import productsRoutes from './products.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/recently-viewed', recentlyViewedRoutes);
router.use('/continue-shopping', continueShoppingRoutes);
router.use('/products', productsRoutes);

export default router;
