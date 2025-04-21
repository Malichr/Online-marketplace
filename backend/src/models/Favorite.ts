import mongoose, { Schema, Document } from 'mongoose';
import { IFavorite } from '../types';

export interface FavoriteDocument extends Omit<IFavorite, '_id'>, Document {}

const favoriteSchema = new Schema<FavoriteDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  addedAt: { type: Date, default: Date.now }
});

favoriteSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model<FavoriteDocument>('Favorite', favoriteSchema); 