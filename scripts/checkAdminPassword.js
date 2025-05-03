import mongoose from 'mongoose';
import User from '../src/models/User.js';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb://localhost:27017/backend-assignment';

async function checkAdminPassword() {
  try {
    await mongoose.connect(MONGODB_URI);
    const admin = await User.findOne({ isAdmin: true });
    if (admin) {
      console.log('Admin details:', admin);
      
      // Test the password
      const isPasswordValid = await bcrypt.compare('admin123', admin.password);
      console.log('Password valid:', isPasswordValid);
    }
  } catch (error) {
    console.error('Error checking admin password:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkAdminPassword();
