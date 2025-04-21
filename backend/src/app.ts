import express, { Express } from 'express';
import cors from 'cors';
import session from 'express-session';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';

const app: Express = express();
app.use(express.json());
app.use(cors());

app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: true
}));

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET környezeti változó nincs beállítva!');
  process.exit(1);
}

export default app; 