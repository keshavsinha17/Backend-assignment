import mongoose from "mongoose";
import "dotenv/config";
import {dbname} from "../config/dbname.js";
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        return true;
    } catch (error) {
        console.error("Database connection error:", error);
        return false;
    }
};

export default connectDB;
