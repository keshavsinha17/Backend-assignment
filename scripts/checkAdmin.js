import mongoose from 'mongoose';
import User from '../src/models/User.js';

const MONGODB_URI = 'mongodb://localhost:27017/backend-assignment';

async function checkAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    const admin = await User.findOne({ isAdmin: true });
    console.log(admin ? 'Admin found' : 'No admin found');
    if (admin) {
      console.log('Admin details:', admin);
    }
  } catch (error) {
    console.error('Error checking admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkAdmin();
