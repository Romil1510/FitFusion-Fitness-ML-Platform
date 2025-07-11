import express from 'express';
import { getMyProfile, login, logout, signup, updateProfile } from '../controllers/authController.js';
import { isAuthenticated } from '../middleware/auth.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login',login)
router.post('/logout',isAuthenticated,logout)
router.get('/me',isAuthenticated,getMyProfile)
router.put("/me/update", isAuthenticated, updateProfile);

export default router;
