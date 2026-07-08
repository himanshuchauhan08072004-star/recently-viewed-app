import { Schema, model, Document, Types } from 'mongoose';

export interface IRecentlyViewed extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  viewedAt: Date;
}

const recentlyViewedSchema = new Schema<IRecentlyViewed>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    viewedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

// Prevent duplicate product entries per user at the DB layer.
recentlyViewedSchema.index({ userId: 1, productId: 1 }, { unique: true });

// Fast "latest viewed first" retrieval per user.
recentlyViewedSchema.index({ userId: 1, viewedAt: -1 });

export const RecentlyViewed = model<IRecentlyViewed>(
  'RecentlyViewed',
  recentlyViewedSchema
);
