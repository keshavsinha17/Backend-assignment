import mongoose from 'mongoose';
import Product from '../src/models/Product.js';

const MONGODB_URI = 'mongodb://localhost:27017/backend-assignment';

async function checkProductStock() {
  try {
    await mongoose.connect(MONGODB_URI);
    const product = await Product.findById('6815f07032b9db15b8fcd357');
    console.log('Product details:', product);
  } catch (error) {
    console.error('Error checking product stock:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkProductStock();
