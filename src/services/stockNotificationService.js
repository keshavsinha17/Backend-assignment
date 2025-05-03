import Product from '../models/Product.js';
import User from '../models/User.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configuration
const STOCK_THRESHOLD_PERCENTAGE = 20; // 20%
const CHECK_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

// Log file setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const LOG_FILE = join(__dirname, '..', '..', 'logs', 'stock_monitor.log');

const logMessage = (message) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, logEntry);
  console.log(logEntry);
};

export const checkStockThreshold = async () => {
  try {
    logMessage('Starting stock threshold check...');
    
    // Get all products
    const products = await Product.find();
    logMessage(`Found ${products.length} products to check`);
    
    const lowStockProducts = products.filter(product => {
      // Calculate threshold as 20% of original stock
      const threshold = Math.ceil(product.originalStock * (STOCK_THRESHOLD_PERCENTAGE / 100));
      const isLowStock = product.stock <= threshold;
      
      if (isLowStock) {
        logMessage(`Product ${product.name} is below threshold:`);
        logMessage(`  Current stock: ${product.stock}`);
        logMessage(`  Original stock: ${product.originalStock}`);
        logMessage(`  Threshold: ${threshold} (${STOCK_THRESHOLD_PERCENTAGE}% of ${product.originalStock})`);
      }
      
      return isLowStock;
    });

    if (lowStockProducts.length > 0) {
      logMessage(`Found ${lowStockProducts.length} products with low stock:`);
      
      // Get all admin users
      const admins = await User.find({ isAdmin: true });
      logMessage(`Notifying ${admins.length} admin(s)...`);
      
      // Send notifications to all admins
      admins.forEach(admin => {
        logMessage(`Sending notification to admin ${admin.email}:`);
        lowStockProducts.forEach(product => {
          logMessage(`  Product ${product.name} is running low on stock (current stock: ${product.stock})`);
        });
      });
    } else {
      logMessage('No products below threshold found');
    }
  } catch (error) {
    logMessage('Error checking stock threshold:', error);
  }
};

// Export a function to check stock periodically
export const startStockMonitoring = () => {
  logMessage(`Starting stock monitoring service`);
  logMessage(`Checking stock every ${CHECK_INTERVAL_MS / 1000 / 60} minutes`);
  logMessage(`Stock threshold set to ${STOCK_THRESHOLD_PERCENTAGE}%`);
  
  // Check stock every hour
  setInterval(checkStockThreshold, CHECK_INTERVAL_MS);
  
  // Initial check
  checkStockThreshold();
};
