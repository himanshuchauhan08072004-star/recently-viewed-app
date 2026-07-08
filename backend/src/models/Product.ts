import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  brand: string;
  image: string;
  price: number;
  discountPrice?: number;
  rating: number;
  stock: number;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true, index: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Product = model<IProduct>('Product', productSchema);
