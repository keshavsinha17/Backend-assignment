import express from 'express';
import { getNearbyProducts } from '../controllers/nearbyController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get nearby products
router.get('/products', auth, getNearbyProducts);

export default router;
