import { recentlyViewedRepository } from '../repositories/recentlyViewed.repository';
import { Order } from '../models/Order';
import { GuestViewedItem } from '../types';
import { ApiError } from '../utils/ApiError';
import { Product } from '../models/Product';
import { emitRecentlyViewedUpdate } from '../sockets/socket';

const MAX_HISTORY = 20;

export const recentlyViewedService = {
  async addView(userId: string, productId: string) {
    const product = await Product.exists({ _id: productId });
    if (!product) {
      throw ApiError.notFound('Product no longer exists');
    }

    const doc = await recentlyViewedRepository.upsertView(userId, productId);
    await recentlyViewedRepository.trimToLimit(userId, MAX_HISTORY);

    const updatedHistory = await recentlyViewedRepository.findLatestByUser(userId, MAX_HISTORY);
    emitRecentlyViewedUpdate(userId, 'recently-viewed:updated', updatedHistory);

    return doc;
  },

  async getHistory(userId: string) {
    return recentlyViewedRepository.findLatestByUser(userId, MAX_HISTORY);
  },

  async removeView(userId: string, productId: string) {
    const deleted = await recentlyViewedRepository.removeOne(userId, productId);
    if (!deleted) {
      throw ApiError.notFound('Item not found in history');
    }

    const updatedHistory = await recentlyViewedRepository.findLatestByUser(userId, MAX_HISTORY);
    emitRecentlyViewedUpdate(userId, 'recently-viewed:updated', updatedHistory);

    return deleted;
  },

  /**
   * Merge guest (AsyncStorage) history into server history.
   * - Dedupe by productId (unique index handles this at DB level too).
   * - Preserve whichever timestamp is newest (guest vs existing server record).
   * - Cap result at MAX_HISTORY, oldest dropped first.
   */
  async mergeGuestHistory(userId: string, items: GuestViewedItem[]) {
    // De-dupe incoming payload itself, keep newest viewedAt per productId.
    const deduped = new Map<string, Date>();
    for (const item of items) {
      const viewedAt = new Date(item.viewedAt);
      const current = deduped.get(item.productId);
      if (!current || viewedAt > current) {
        deduped.set(item.productId, viewedAt);
      }
    }

    for (const [productId, viewedAt] of deduped.entries()) {
      await recentlyViewedRepository.upsertViewIfNewer(userId, productId, viewedAt);
    }

    await recentlyViewedRepository.trimToLimit(userId, MAX_HISTORY);
    const merged = await recentlyViewedRepository.findLatestByUser(userId, MAX_HISTORY);

    emitRecentlyViewedUpdate(userId, 'recently-viewed:updated', merged);

    return merged;
  },

  /**
   * Continue Shopping = recently viewed products the user has NOT purchased.
   */
  async getContinueShopping(userId: string) {
    const viewed = await recentlyViewedRepository.findLatestByUser(userId, MAX_HISTORY);

    const orders = await Order.find({ userId, status: 'completed' }).select('productIds');
    const purchasedIds = new Set(
      orders.flatMap((o) => o.productIds.map((id) => id.toString()))
    );

    return viewed.filter(
      (v) => !purchasedIds.has((v.productId as unknown as { _id: object })._id.toString())
    );
  },
};
