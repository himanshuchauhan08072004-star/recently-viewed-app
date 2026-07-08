import { Schema, model, Document, Types } from 'mongoose';

export interface IOrder extends Document {
  userId: Types.ObjectId;
  productIds: Types.ObjectId[];
  status: 'pending' | 'completed' | 'cancelled';
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    productIds: [{ type: Schema.Types.ObjectId, ref: 'Product', required: true }],
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'completed',
    },
  },
  { timestamps: true }
);

export const Order = model<IOrder>('Order', orderSchema);
