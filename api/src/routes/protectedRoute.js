import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

// Controllers for handling protected route logic
const adminController = (req, res) => {
    res.status(200).json({ message: "Welcome to the Admin Dashboard" });
};

const userController = (req, res) => {
    res.status(200).json({ message: "Welcome to the User Dashboard" });
};

const router = express.Router();

// Admin-only route
router.get('/admin/dashboard', authenticate, authorize(['admin']), adminController);

// User-only route
router.get('/user/welcome', authenticate, authorize(['user']), userController);

export default router;
