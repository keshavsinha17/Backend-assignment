import express from 'express';
import { createNotification, getNotifications, markAsRead } from '../controllers/notificationController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.get('/', auth, getNotifications);
router.patch('/:id/read', auth, markAsRead);

// Admin routes
router.post('/', auth, createNotification);

export default router;
