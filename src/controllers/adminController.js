import User from '../models/User.js';
import Product from '../models/Product.js';
import Warehouse from '../models/Warehouse.js';
import Order from '../models/Order.js';

export const getUsers = async (req, res) => {
  try {
    const { search, status } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) {
      query.status = status;
    }

    const users = await User.find(query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;
    await User.findByIdAndUpdate(userId, { status });
    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addWarehouse = async (req, res) => {
  try {
    const warehouse = new Warehouse(req.body);
    await warehouse.save();
    res.status(201).json(warehouse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsByLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    
    // Find nearby warehouses
    const nearbyWarehouses = await Warehouse.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: 10000 // 10km in meters
        }
      }
    });

    // Get products from nearby warehouses
    const products = await Product.find({
      warehouseId: { $in: nearbyWarehouses.map(wh => wh._id) }
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import { checkStockThreshold } from '../services/stockNotificationService.js';

export const handleOrder = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status
    order.status = status;
    await order.save();

    // Update product stock if order is accepted
    if (status === 'accepted') {
      for (const item of order.products) {
        const product = await Product.findById(item.productId);
        product.stock -= item.quantity;
        await product.save();

        // Check stock threshold after updating
        if (product.stock <= product.stock * 0.2) {
          // Trigger immediate notification for this product
          await checkStockThreshold();
        }
      }
    }

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
