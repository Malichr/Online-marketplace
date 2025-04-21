import mongoose, { Schema, Document } from 'mongoose';
import { IOrder } from '../types';

export interface OrderDocument extends Omit<IOrder, '_id'>, Document {}

const orderSchema = new Schema<OrderDocument>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  purchaseDate: { type: Date, default: Date.now },
  price: Number
});

export default mongoose.model<OrderDocument>('Order', orderSchema); 