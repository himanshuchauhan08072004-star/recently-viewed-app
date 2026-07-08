import { Types } from 'mongoose';
import { RecentlyViewed } from '../models/RecentlyViewed';

const MAX_HISTORY = 20;

export const recentlyViewedRepository = {
  /**
   * Upsert a view: creates if new, updates viewedAt (moves to top) if exists.
   * The compound unique index {userId, productId} guarantees no duplicates.
   */
  async upsertView(userId: string, productId: string, viewedAt: Date = new Date()) {
    return RecentlyViewed.findOneAndUpdate(
      { userId, productId },
      { $set: { viewedAt } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  },

  /**
   * Only overwrite viewedAt if the incoming timestamp is newer than what's stored.
   * Used during guest -> server merge so we never lose a more recent server-side view.
   */
  async upsertViewIfNewer(userId: string, productId: string, viewedAt: Date) {
    const existing = await RecentlyViewed.findOne({ userId, productId });

    if (!existing) {
      return RecentlyViewed.create({ userId, productId, viewedAt });
    }

    if (viewedAt > existing.viewedAt) {
      existing.viewedAt = viewedAt;
      await existing.save();
    }

    return existing;
  },

 async findLatestByUser(userId: string, limit = MAX_HISTORY) {
    const docs = await RecentlyViewed.find({ userId })
      .sort({ viewedAt: -1 })
      .limit(limit)
      .populate('productId');

    // If a product was deleted after being viewed, populate() returns null
    // for productId — filter those out so the client never has to handle it.
    return docs.filter((doc) => doc.productId !== null);
  },

  async countByUser(userId: string) {
    return RecentlyViewed.countDocuments({ userId });
  },

  /**
   * Trim history down to MAX_HISTORY, removing the oldest entries beyond the cap.
   */
  async trimToLimit(userId: string, limit = MAX_HISTORY) {
    const excess = await RecentlyViewed.find({ userId })
      .sort({ viewedAt: -1 })
      .skip(limit)
      .select('_id');

    if (excess.length === 0) return;

    await RecentlyViewed.deleteMany({
      _id: { $in: excess.map((doc) => doc._id) },
    });
  },

  async removeOne(userId: string, productId: string) {
    return RecentlyViewed.findOneAndDelete({ userId, productId });
  },

  async allProductIdsForUser(userId: string): Promise<Types.ObjectId[]> {
    const docs = await RecentlyViewed.find({ userId }).select('productId');
    return docs.map((d) => d.productId);
  },
};
