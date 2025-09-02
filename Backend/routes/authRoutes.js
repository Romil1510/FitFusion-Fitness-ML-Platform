import express from 'express';
import { forgotPassword, getMyProfile, login, logout, resetPassword, signup, updateProfile } from '../controllers/authController.js';
import { isAuthenticated } from '../middleware/auth.js';

import { updateUserProfile, getUserProfile } from "../controllers/authController.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/login',login)
router.post('/logout',isAuthenticated,logout)
router.get('/me',isAuthenticated,getMyProfile)
router.put("/me/update", isAuthenticated, updateProfile);

// Password Reset Routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post("/update", isAuthenticated, updateUserProfile);
router.get("/profile", isAuthenticated, getUserProfile);

export default router;
