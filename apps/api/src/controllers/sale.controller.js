import mongoose from 'mongoose';
import { Sale } from '../models/Sale.js';
import { Product } from '../models/Product.js';

export const createSale = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { items, paymentMethod, receiptType } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items provided' });
    }

    let totalAmount = 0;
    const saleItems = [];

    for (let item of items) {
      const product = await Product.findById(item.product).session(session);
      
      if (!product || !product.isActive) {
        throw new Error(`Product not found or inactive: ${item.product}`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      // Decrease stock
      product.stock -= item.quantity;
      await product.save({ session });

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      saleItems.push({
        product: product._id,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal
      });
    }

    const newSale = new Sale({
      cashier: req.userId,
      items: saleItems,
      totalAmount,
      paymentMethod,
      receiptType
    });

    await newSale.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(201).json(newSale);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
};

export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate('cashier', 'name').populate('items.product', 'name barcode').sort({ createdAt: -1 });
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
