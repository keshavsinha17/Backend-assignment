import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { startStockMonitoring } from './src/services/stockNotificationService.js';
import { adminAuth } from './src/middleware/adminAuth.js';
import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT || 5000;
const LOG_FILE = path.join(__dirname, 'logs', 'server.log');

// Create logs directory if it doesn't exist
if (!fs.existsSync(path.dirname(LOG_FILE))) {
  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
}

// Initialize Express app
const app = express();

// Middleware setup
const setupMiddleware = () => {
  app.use(cors({
    origin: true,
    credentials: true
  }));
  app.use(cookieParser());
  app.use(express.json());
  
  // Set up logging
  app.use((req, res, next) => {
    const logEntry = `${new Date().toISOString()} - ${req.method} ${req.path}\n`;
    fs.appendFileSync(LOG_FILE, logEntry);
    next();
  });
};

// Route setup
const setupRoutes = () => {
  // Import routes
  const authRoutes = require('./src/routes/authRoutes.js');
  const adminRoutes = require('./src/routes/adminRoutes.js');
  const orderRoutes = require('./src/routes/orderRoutes.js');
  const notificationRoutes = require('./src/routes/notificationRoutes.js');
  const nearbyRoutes = require('./src/routes/nearbyRoutes.js');

  // Admin auth middleware
  app.use('/api/admin', adminAuth);

  // Register routes
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/nearby', nearbyRoutes);
};

// Error handling
const setupErrorHandling = () => {
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  });
};

// Start server
const startServer = async () => {
  try {
    // Setup middleware
    setupMiddleware();

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Start stock monitoring
    startStockMonitoring();

    // Setup routes
    setupRoutes();

    // Setup error handling
    setupErrorHandling();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

// Start the application
startServer();