import mongoose from 'mongoose';

const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: {
      latitude: Number,
      longitude: Number
    },
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Warehouse', warehouseSchema);
