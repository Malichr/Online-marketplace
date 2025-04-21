import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from '../types';

export interface UserDocument extends Omit<IUser, '_id'>, Document {
  _id: Types.ObjectId;
}

const userSchema = new Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['seller', 'buyer'], required: true }
});

export default mongoose.model<UserDocument>('User', userSchema); 