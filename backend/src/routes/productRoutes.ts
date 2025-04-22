import { Router, Request, Response } from 'express';
import Product, { ProductDocument } from '../models/Product';
import Order, { OrderDocument } from '../models/Order';
import Favorite, { FavoriteDocument } from '../models/Favorite';
import { authenticate } from '../middleware/auth';
import { JwtPayload, CreateProductRequest, UpdateProductRequest } from '../types';

interface AuthRequest extends Request {
  user?: JwtPayload;
  body: CreateProductRequest | UpdateProductRequest;
  params: {
    id: string;
    [key: string]: string;
  };
}

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const products = await Product.find().populate('seller', 'username');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'seller') {
      return res.status(403).json({ message: 'Csak eladó regisztrált felhasználó tölthet fel terméket' });
    }

    const { name, description, price } = req.body;
    const newProduct = new Product({
      name,
      description,
      price,
      seller: req.user.id
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/:id/buy', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Termék nem található' });
    }
    if (product.sold) {
      return res.status(400).json({ message: 'A termék már el van adva' });
    }
    if (product.seller.toString() === req.user?.id) {
      return res.status(400).json({ message: 'A saját terméket nem vásárolhatod meg' });
    }
    
    product.sold = true;
    product.soldDate = new Date();
    await product.save();
    
    const order = new Order({
      product: product._id,
      buyer: req.user?.id,
      price: product.price
    });
    await order.save();
    
    res.json({ message: 'Vásárlás sikeres', order });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/sales', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'seller') {
      return res.status(403).json({ message: 'Csak eladó regisztrált felhasználó érheti el az értékesítési adatokat' });
    }
    
    const products = await Product.find({ seller: req.user.id, sold: true });
    
    const productIds = products.map(product => product._id);
    const orders = await Order.find({ product: { $in: productIds } }).populate('buyer', 'username');
    
    const salesWithBuyerInfo = products.map(product => {
      const productId = product._id ? product._id.toString() : '';
      const order = orders.find(o => o.product.toString() === productId);
      
      return {
        ...product.toObject(),
        buyer: order ? order.buyer : null
      };
    });
    
    res.json(salesWithBuyerInfo);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/orders', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ buyer: req.user?.id })
      .populate({
        path: 'product',
        populate: {
          path: 'seller',
          select: 'username'
        }
      });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/:id/favorite', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const productId = req.params.id;
    const userId = req.user?.id;

    const existingFavorite = await Favorite.findOne({ 
      user: userId, 
      product: productId 
    });

    if (existingFavorite) {
      await Favorite.deleteOne({ _id: existingFavorite._id });
      res.json({ message: 'Termék eltávolítva a kedvencekből', isFavorite: false });
    } else {
      const favorite = new Favorite({
        user: userId,
        product: productId
      });
      await favorite.save();
      res.json({ message: 'Termék hozzáadva a kedvencekhez', isFavorite: true });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/favorites', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const favorites = await Favorite.find({ user: req.user?.id })
      .populate({
        path: 'product',
        populate: { path: 'seller', select: 'username' }
      });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Termék nem található' });
    }
    
    if (product.seller.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Csak a saját terméket lehet törölni' });
    }

    if (product.sold) {
      await Order.deleteOne({ product: product._id });
    }

    await Favorite.deleteMany({ product: product._id });
    await Product.deleteOne({ _id: product._id });
    
    res.json({ message: 'Termék sikeresen törölve' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.delete('/orders/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Rendelés nem található' });
    }

    if (order.buyer.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Csak a saját rendelést lehet törölni' });
    }

    await Order.deleteOne({ _id: order._id });
    
    res.json({ message: 'Rendelés sikeresen törölve' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Termék nem található' });
    }
    
    if (product.seller.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Csak a saját terméket lehet módosítani' });
    }

    const { name, description, price } = req.body;
    
    product.name = name;
    product.description = description;
    product.price = price;
    
    await product.save();
    
    res.json({ message: 'Termék sikeresen módosítva', product });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router; 