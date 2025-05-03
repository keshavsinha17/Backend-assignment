import express from 'express';
import { createOrder, handleOrder, getUserOrders } from '../controllers/orderController.js';
import { auth } from '../middleware/auth.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// User routes
router.post('/', auth, createOrder);  // Create new order
router.get('/user', auth, getUserOrders);  // Get user's orders

// Admin routes
router.patch('/:id', adminAuth, handleOrder);  // Approve/reject order

export default router;
