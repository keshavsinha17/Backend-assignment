import mongoose from 'mongoose';
import Product from '../src/models/Product.js';

const MONGODB_URI = 'mongodb://localhost:27017/backend-assignment';

async function checkProduct() {
  try {
    await mongoose.connect(MONGODB_URI);
    const product = await Product.findById('6815f07032b9db15b8fcd357');
    console.log(product ? 'Product found' : 'Product not found');
    if (product) {
      console.log('Product details:', product);
    }
  } catch (error) {
    console.error('Error checking product:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkProduct();
