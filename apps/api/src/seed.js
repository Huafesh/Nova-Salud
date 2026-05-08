import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Product } from './models/Product.js';
import { Sale } from './models/Sale.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:secretpassword@localhost:27017/nova-salud?authSource=admin';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB. Clearing database...');

    await User.deleteMany({});
    await Product.deleteMany({});
    await Sale.deleteMany({});

    console.log('✅ Database cleared.');

    // 1. Create Users
    const salt = bcrypt.genSaltSync(10);
    const adminPassword = bcrypt.hashSync('admin123', salt);

    const users = await User.insertMany([
      { name: 'Administrador General', email: 'admin', password: adminPassword, role: 'admin' }
    ]);

    console.log('✅ Users created:', users.length);

    // 2. Create Products
    const products = await Product.insertMany([
      { barcode: '1000000000001', name: 'Paracetamol 500mg', category: 'Analgésico', price: 1.5, stock: 100, minStockAlert: 10 },
      { barcode: '1000000000002', name: 'Ibuprofeno 400mg', category: 'Antiinflamatorio', price: 2.0, stock: 50, minStockAlert: 10 },
      { barcode: '1000000000003', name: 'Amoxicilina 500mg', category: 'Antibiótico', price: 5.0, stock: 3, minStockAlert: 5 }, // Stock crítico
      { barcode: '1000000000004', name: 'Loratadina 10mg', category: 'Antihistamínico', price: 1.0, stock: 4, minStockAlert: 5 }, // Stock crítico
      { barcode: '1000000000005', name: 'Omeprazol 20mg', category: 'Antiácido', price: 3.5, stock: 60, minStockAlert: 15 },
      { barcode: '1000000000006', name: 'Aspirina 100mg', category: 'Analgésico', price: 1.2, stock: 2, minStockAlert: 10 }, // Stock crítico
      { barcode: '1000000000007', name: 'Cetirizina 10mg', category: 'Antihistamínico', price: 1.8, stock: 20, minStockAlert: 5 },
      { barcode: '1000000000008', name: 'Diclofenaco 50mg', category: 'Antiinflamatorio', price: 2.5, stock: 45, minStockAlert: 10 },
      { barcode: '1000000000009', name: 'Vitamina C 1000mg', category: 'Vitamina', price: 4.0, stock: 80, minStockAlert: 20 },
      { barcode: '1000000000010', name: 'Salbutamol Inhalador', category: 'Broncodilatador', price: 12.0, stock: 15, minStockAlert: 5 }
    ]);

    console.log('✅ Products created:', products.length);
    console.log('🎉 Seed process completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error in seed script:', error);
    process.exit(1);
  }
};

seedDatabase();
