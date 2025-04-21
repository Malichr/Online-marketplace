import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { UserDocument } from '../models/User';
import { validateRegistration, validateLogin } from '../middleware/validation';
import { Types } from 'mongoose';

const router = Router();

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

interface RegisterRequest {
  username: string;
  password: string;
  role: 'buyer' | 'seller';
}

interface LoginRequest {
  username: string;
  password: string;
}

router.post('/register', validateRegistration, async (req: Request<{}, {}, RegisterRequest>, res: Response) => {
  try {
    const { username, password, role } = req.body;

    console.log('Received registration data:', {
      username,
      passwordType: typeof password,
      passwordLength: password?.length,
      role
    });

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'A felhasználónév már foglalt' });
    }

    try {
      const passwordToHash = String(password).trim();
      console.log('Password to hash:', {
        type: typeof passwordToHash,
        length: passwordToHash.length,
        isEmpty: passwordToHash === ''
      });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(passwordToHash, salt);

      const user = new User({ 
        username, 
        password: hashedPassword, 
        role 
      });
      
      await user.save();
      res.status(201).json({ message: 'Sikeres regisztráció' });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Password hashing error:', error);
        throw error;
      }
      throw new Error('Ismeretlen hiba történt a jelszó hashelése során');
    }
  } catch (error) {
    console.error('Registration error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      code: error instanceof Error && 'code' in error ? (error as any).code : undefined,
      stack: error instanceof Error ? error.stack : undefined
    });
    res.status(500).json({ 
      message: 'Szerver hiba történt a regisztráció során',
      details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
    });
  }
});

router.post('/login', validateLogin, async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user || !user._id) {
      return res.status(400).json({ message: 'Hibás felhasználónév vagy jelszó' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Hibás felhasználónév vagy jelszó' });
    }

    const userId = Types.ObjectId.isValid(user._id) ? user._id : new Types.ObjectId(user._id);

    const token = jwt.sign(
      { 
        id: userId.toString(), 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET || '',
      { expiresIn: '1h' }
    );

    const response: LoginResponse = {
      token,
      user: {
        id: userId.toString(),
        username: user.username,
        role: user.role
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error instanceof Error ? error.message : error);
    res.status(500).json({ message: 'Szerver hiba történt a bejelentkezés során' });
  }
});

export default router; 