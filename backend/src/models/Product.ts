import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from '../types';

export interface ProductDocument extends Omit<IProduct, '_id'>, Document {}

const productSchema = new Schema<ProductDocument>({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sold: { type: Boolean, default: false },
  soldDate: { type: Date }
});

export default mongoose.model<ProductDocument>('Product', productSchema); 