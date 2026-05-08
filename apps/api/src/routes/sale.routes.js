import express from 'express';
import { createSale, getSales } from '../controllers/sale.controller.js';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', verifyToken, createSale);
router.get('/', verifyToken, isAdmin, getSales); // Admin only to view all sales

export default router;
