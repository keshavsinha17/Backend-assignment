import mongoose from 'mongoose';
import Product from '../src/models/Product.js';

const MONGODB_URI = 'mongodb://localhost:27017/backend-assignment';

async function reduceStock() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    // Get the product
    const product = await Product.findById('6815f07032b9db15b8fcd357');
    if (!product) {
      console.log('Product not found');
      return;
    }

    console.log('Current stock:', product.stock);
    
    // Reduce stock below threshold (20% of current stock)
    const threshold = Math.ceil(product.stock * 0.2);
    const newStock = threshold - 1; // Set to 1 less than threshold
    
    console.log('Reducing stock to:', newStock);
    console.log('Threshold:', threshold);
    
    // Update the product
    product.stock = newStock;
    await product.save();
    
    console.log('Stock updated successfully');
    console.log('New stock:', product.stock);
  } catch (error) {
    console.error('Error reducing stock:', error);
  } finally {
    await mongoose.disconnect();
  }
}

reduceStock();
