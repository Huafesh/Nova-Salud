import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  barcode: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  minStockAlert: { type: Number, required: true, default: 5 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.index({ barcode: 1, isActive: 1 });

export const Product = mongoose.model('Product', productSchema);
