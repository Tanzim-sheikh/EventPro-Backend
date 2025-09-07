import express from 'express';
import { userSignup, userLogin } from './controller.js';
import { protect } from '../../helper/common/authMiddleware.js';
const userRoutes = express.Router();



// Route for user signup
userRoutes.post('/UserSignup', userSignup);
userRoutes.post('/UserLogin', userLogin);

export default userRoutes