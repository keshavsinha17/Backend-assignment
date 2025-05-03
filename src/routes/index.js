import express from 'express';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import orderRoutes from './orderRoutes.js';

const router = express.Router();

// Mount auth routes
router.use('/auth', authRoutes);

// Mount admin routes
router.use('/admin', adminRoutes);

// Mount order routes
router.use('/orders', orderRoutes);

export default router;
