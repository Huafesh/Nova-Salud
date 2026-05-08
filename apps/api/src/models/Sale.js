import mongoose from 'mongoose';

const saleItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  subtotal: { type: Number, required: true }
});

const saleSchema = new mongoose.Schema({
  cashier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [saleItemSchema],
  totalAmount: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, enum: ['efectivo', 'tarjeta', 'transferencia'], default: 'efectivo' },
  receiptType: { type: String, enum: ['digital', 'impreso'], default: 'impreso' },
  status: { type: String, enum: ['completada', 'anulada'], default: 'completada' }
}, { timestamps: true });

export const Sale = mongoose.model('Sale', saleSchema);
