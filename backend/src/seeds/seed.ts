import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import Product from '../models/Product';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/marketplace';

const seedUsers = async () => {
  await User.deleteMany({});
  
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('password123', salt);
  
  const users = [
    {
      username: 'elado1',
      password,
      role: 'seller'
    },
    {
      username: 'elado2',
      password,
      role: 'seller'
    },
    {
      username: 'vasarlo1',
      password,
      role: 'buyer'
    },
    {
      username: 'vasarlo2',
      password,
      role: 'buyer'
    }
  ];
  
  const createdUsers = await User.insertMany(users);
  console.log(`${createdUsers.length} felhasználó létrehozva`);
  return createdUsers;
};

const seedProducts = async (users: any[]) => {
  await Product.deleteMany({});
  
  const sellers = users.filter(user => user.role === 'seller');
  
  const products = [
    {
      name: 'Laptop',
      description: 'Kiváló állapotú laptop, 16GB RAM, 512GB SSD',
      price: 150000,
      seller: sellers[0]._id,
      sold: false
    },
    {
      name: 'Mobiltelefon',
      description: 'Új állapotú okostelefon, dual SIM, 128GB tároló',
      price: 80000,
      seller: sellers[0]._id,
      sold: false
    },
    {
      name: 'Kávéfőző',
      description: 'Alig használt kávéfőző, automata tisztítással',
      price: 35000,
      seller: sellers[1]._id,
      sold: false
    },
    {
      name: 'Kerékpár',
      description: 'Mountain bike, 27 sebességes, 29"-os kerekekkel',
      price: 95000,
      seller: sellers[1]._id,
      sold: false
    },
    {
      name: 'Könyv csomag',
      description: 'Fantasy könyvcsomag, 5 kötet',
      price: 15000,
      seller: sellers[0]._id,
      sold: true,
      soldDate: new Date()
    }
  ];
  
  const createdProducts = await Product.insertMany(products);
  console.log(`${createdProducts.length} termék létrehozva`);
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB kapcsolat létrejött');
    
    const users = await seedUsers();
    await seedProducts(users);
    
    console.log('Adatbázis inicializálás sikeres');
    process.exit(0);
  } catch (error) {
    console.error('Hiba az adatbázis inicializálása során:', error);
    process.exit(1);
  }
};

seedDatabase(); 