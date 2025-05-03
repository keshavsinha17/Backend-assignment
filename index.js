import express from "express";
import "dotenv/config";
import connectDB from "./src/DB/index.js";
import cors from "cors";
import routes from "./src/routes/index.js";
import { startStockMonitoring } from "./src/services/stockNotificationService.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

connectDB().then((isConnected) => {
  if (isConnected) {
    console.log('Database connected successfully');
    // Start stock monitoring
    startStockMonitoring();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } else {
    console.error("Failed to connect to database. Server will not start.");
    process.exit(1);
  }
}).catch((error) => {
  console.error("Database connection error:", error);
  process.exit(1);
});
