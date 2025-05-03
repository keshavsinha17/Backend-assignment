import express from 'express';
import { auth } from '../middleware/auth.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { 
  getUsers, 
  updateUserStatus, 
  addWarehouse, 
  addProduct, 
  getProductsByLocation, 
  handleOrder 
} from '../controllers/adminController.js';

const router = express.Router();

// User management
router.get('/users', adminAuth, getUsers);
router.put('/users/:userId/status', adminAuth, updateUserStatus);

// Warehouse management
router.post('/warehouses', adminAuth, addWarehouse);

// Product management
router.post('/products', adminAuth, addProduct);

// Order management
router.put('/orders/:orderId/status', adminAuth, handleOrder);

// Product search by location
router.get('/products/nearby', auth, getProductsByLocation);

export default router;
