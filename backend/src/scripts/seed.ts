import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { Product } from '../models/Product';

const sampleProducts = [
  { name: 'Classic Cotton T-Shirt', brand: 'Roadster', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', price: 799, discountPrice: 499, rating: 4.2, stock: 50 },
  { name: 'Running Sneakers', brand: 'Puma', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', price: 3499, discountPrice: 2799, rating: 4.5, stock: 30 },
  { name: 'Slim Fit Denim Jeans', brand: 'Levis', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d', price: 2999, discountPrice: 2199, rating: 4.0, stock: 20 },
  { name: 'Analog Wrist Watch', brand: 'Fossil', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d', price: 8999, discountPrice: 6999, rating: 4.7, stock: 15 },
  { name: 'Leather Backpack', brand: 'WildCraft', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', price: 2499, discountPrice: 1799, rating: 4.3, stock: 25 },
  { name: 'Wireless Headphones', brand: 'boAt', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', price: 2999, discountPrice: 1499, rating: 4.1, stock: 40 },
  { name: 'Casual Check Shirt', brand: 'H&M', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c', price: 1299, discountPrice: 899, rating: 3.9, stock: 35 },
  { name: 'Formal Leather Shoes', brand: 'Bata', image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1', price: 3299, discountPrice: 2499, rating: 4.4, stock: 18 },
  { name: 'Aviator Sunglasses', brand: 'Ray-Ban', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f', price: 5999, discountPrice: 4499, rating: 4.6, stock: 12 },
  { name: 'Sports Track Pants', brand: 'Nike', image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea', price: 1999, discountPrice: 1399, rating: 4.2, stock: 45 },
  { name: 'Canvas Sling Bag', brand: 'Fastrack', image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3', price: 899, discountPrice: 649, rating: 3.8, stock: 28 },
  { name: 'Denim Jacket', brand: 'Levis', image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a', price: 3999, discountPrice: 2999, rating: 4.5, stock: 22 },
];

async function seed() {
  await connectDB();
  await Product.deleteMany({});
  const created = await Product.insertMany(sampleProducts);
  console.log('[SEED] Inserted products:');
  created.forEach((p) => console.log(`  - ${p.name} => ${p._id}`));
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[SEED] Failed:', err);
  process.exit(1);
});