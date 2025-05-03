import mongoose from 'mongoose';
import User from '../src/models/User.js';

const MONGODB_URI = 'mongodb://localhost:27017/backend-assignment';

async function checkUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    const user = await User.findById('6815ed0ea5310db6e55f30ed');
    console.log(user ? 'User found' : 'User not found');
    if (user) {
      console.log('User details:', user);
    }
  } catch (error) {
    console.error('Error checking user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkUser();
