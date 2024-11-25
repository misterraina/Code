import express from 'express';
import { registerUser, loginUser, registerAdmin, authStatus, logoutUser, createUser, editUser, deleteUser, getAllUsers } from '../controller/authController.js';
import { restrictAdminRegistration, restrictAdmin, authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get("/status", authStatus);
router.post("/logout", logoutUser);

// Admin-only route for registration
router.post('/admin/register', restrictAdminRegistration, registerAdmin);

// User management routes (admin-only access or authenticated user)
// router.post('/user',authenticate, restrictAdmin, createUser);
// router.put('/user/:userId',authenticate, restrictAdmin, editUser);
// router.delete('/user/:userId',authenticate, restrictAdmin, deleteUser);
// router.get('/users',authenticate, restrictAdmin, getAllUsers);

router.post('/create/user',registerUser);
router.patch('/user/:userId',editUser);
router.delete('/user/:userId',deleteUser);
router.get('/users',getAllUsers); 

export default router;
