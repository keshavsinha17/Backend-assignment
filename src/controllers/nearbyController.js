import Product from '../models/Product.js';
import User from '../models/User.js';

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

export const getNearbyProducts = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;
    
    // Get user's location if not provided
    let userLocation;
    if (!latitude || !longitude) {
      const user = await User.findById(req.user._id);
      if (!user.location) {
        return res.status(400).json({ message: 'Location not found' });
      }
      userLocation = user.location;
    } else {
      userLocation = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
    }

    // Get all products
    const products = await Product.find().populate('warehouseId', 'name location');

    // Filter products within radius
    const nearbyProducts = products.filter(product => {
      if (!product.location || !product.warehouseId.location) return false;
      
      const productDistance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        product.warehouseId.location.latitude,
        product.warehouseId.location.longitude
      );

      return productDistance <= radius;
    });

    // Sort by distance
    nearbyProducts.sort((a, b) => {
      const distA = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        a.warehouseId.location.latitude,
        a.warehouseId.location.longitude
      );
      const distB = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        b.warehouseId.location.latitude,
        b.warehouseId.location.longitude
      );
      return distA - distB;
    });

    res.json(nearbyProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
