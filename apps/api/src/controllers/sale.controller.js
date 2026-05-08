import { Sale } from '../models/Sale.js';
import { Product } from '../models/Product.js';

export const createSale = async (req, res) => {
  try {
    const { items, paymentMethod, receiptType } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items provided' });
    }

    let totalAmount = 0;
    const saleItems = [];

    for (let item of items) {
      const product = await Product.findById(item.product);
      
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Producto no encontrado o inactivo: ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuficiente para: ${product.name}` });
      }

      // Decrease stock
      product.stock -= item.quantity;
      await product.save();

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

    await newSale.save();

    res.status(201).json(newSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('cashier', 'name')
      .populate('items.product', 'name barcode')
      .sort({ createdAt: -1 });
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
