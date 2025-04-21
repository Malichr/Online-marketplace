import { Types } from 'mongoose';

export interface IUser {
  _id?: Types.ObjectId;
  username: string;
  password: string;
  role: 'buyer' | 'seller';
}

export interface IProduct {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  seller: Types.ObjectId | IUser;
  sold: boolean;
  soldDate?: Date;
}

export interface IOrder {
  _id?: Types.ObjectId;
  product: Types.ObjectId | IProduct;
  buyer: Types.ObjectId | IUser;
  purchaseDate: Date;
  price: number;
}

export interface IFavorite {
  _id?: Types.ObjectId;
  user: Types.ObjectId | IUser;
  product: Types.ObjectId | IProduct;
  addedAt: Date;
}

export interface JwtPayload {
  id: string;
  username: string;
  role: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
}

export interface UpdateProductRequest {
  name: string;
  description?: string;
  price: number;
}

export interface RegisterRequest {
  username: string;
  password: string;
  role: 'buyer' | 'seller';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
} 