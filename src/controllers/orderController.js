import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// User creates order - order is created with pending status
export const createOrder = async (req, res) => {
  try {
    // Check if user is approved
    const user = await User.findById(req.user._id);
    if (!user || user.status !== 'approved') {
      return res.status(403).json({ 
        message: 'Only approved users can create orders' 
      });
    }

    const { products, deliveryAddress, deliveryLocation } = req.body;

    // Validate products
    const productDetails = await Promise.all(products.map(async product => {
      const productDoc = await Product.findById(product.productId);
      if (!productDoc) {
        throw new Error(`Product not found: ${product.productId}`);
      }
      
      return {
        productId: productDoc._id,
        quantity: product.quantity,
        price: productDoc.price
      };
    }));

    // Calculate total amount
    const totalAmount = productDetails.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );

    // Create order with pending status
    const order = new Order({
      userId: req.user._id,
      products: productDetails,
      totalAmount,
      deliveryAddress,
      deliveryLocation,
      status: 'pending'  // Order starts as pending
    });

    await order.save();

    res.status(201).json({
      message: 'Order created successfully. Awaiting admin approval',
      order
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(400).json({ 
      message: error.message 
    });
  }
};

// Admin approves or rejects order
export const handleOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Order is already processed' 
      });
    }

    // Validate status
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be either "accepted" or "rejected"' 
      });
    }

    // Update stock only if order is accepted
    if (status === 'accepted') {
      // Update stock levels
      await Promise.all(order.products.map(async product => {
        await Product.findByIdAndUpdate(product.productId, {
          $inc: { stock: -product.quantity }
        });
      }));
    }

    // Update order status
    order.status = status;
    await order.save();

    res.json({
      message: `Order ${status === 'accepted' ? 'approved' : 'rejected'} successfully`,
      order
    });
  } catch (error) {
    console.error('Order handling error:', error);
    res.status(500).json({ 
      message: error.message 
    });
  }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('userId', 'firstName lastName')
      .populate('products.productId', 'name price');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
