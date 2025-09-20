import express from 'express';
import { userSignup, userLogin, userProfile } from './controller.js';
import { protect } from '../../helper/common/authMiddleware.js';
const userRoutes = express.Router();



// Route for user signup
userRoutes.post('/UserSignup', userSignup);
userRoutes.post('/UserLogin', userLogin);

// Protected route - requires authentication
userRoutes.get('/UserProfile', protect, userProfile);

export default userRoutes