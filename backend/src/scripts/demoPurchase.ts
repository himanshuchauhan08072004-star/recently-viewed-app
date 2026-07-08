import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { User } from '../models/User';
import { RecentlyViewed } from '../models/RecentlyViewed';
import { Order } from '../models/Order';

async function markOnePurchased() {
  await connectDB();

  const user = await User.findOne().sort({ createdAt: -1 });
  if (!user) {
    console.log('[DEMO] No user found — log in via the app first.');
    process.exit(1);
  }

  const viewed = await RecentlyViewed.findOne({ userId: user.id }).sort({ viewedAt: -1 });
  if (!viewed) {
    console.log('[DEMO] No recently-viewed items — view a product in the app first.');
    process.exit(1);
  }

  await Order.create({
    userId: user.id,
    productIds: [viewed.productId],
    status: 'completed',
  });

  console.log(`[DEMO] Marked product ${viewed.productId} as purchased for user ${user.email}`);
  console.log('[DEMO] It will still show in Recently Viewed, but disappear from Continue Shopping.');

  await mongoose.disconnect();
  process.exit(0);
}

markOnePurchased().catch((err) => {
  console.error('[DEMO] Failed:', err);
  process.exit(1);
});