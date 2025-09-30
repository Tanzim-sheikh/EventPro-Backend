import express from 'express';
import { userSignup, userLogin, userProfile, useremailVerify, userForgotPassword, userResetPassword } from './controller.js';
import { protect, authorize } from '../../helper/common/authMiddleware.js';
import upload from '../../helper/middleware/upload.js';
const userRoutes = express.Router();



// Route for user signup
userRoutes.post('/UserSignup', upload.single('profilePhoto'), userSignup);
userRoutes.post('/userSignup', upload.single('profilePhoto'), userSignup);
userRoutes.post('/signup', upload.single('profilePhoto'), userSignup);
userRoutes.post('/UserLogin', userLogin);
userRoutes.post('/UserEmailVerification', useremailVerify)
userRoutes.put("/UserForgotPassword", userForgotPassword);
userRoutes.put("/UserResetPassword", userResetPassword);
// Protected route - requires authentication
userRoutes.get('/UserProfile', protect, authorize("user"), userProfile);

export default userRoutes