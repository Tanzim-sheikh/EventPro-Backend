import { userSignupService, userLoginService, userProfileService } from './service.js';
import { generateToken } from '../../helper/common/jwtToken.js';
export const userSignup = async (req, res) => {
    try {
        console.log("👉 Received Body:", req.body); 
        const result = await userSignupService(req.body);
        res.status(201).json(result);
    } catch (error) {
        // res.status(500).json({ message: 'Signup Failed', error });
        res.status(400).json({ message: error.message });
    }
}

export const userLogin = async (req, res) => {
    try {
         const result = await userLoginService(req.body);
         console.log("👉 Login Result:", result.user._id, "Type:", result.user.type);
         
         // Ensure we're using the type from the user document
         const userType = result.user.type;
         if (!userType) {
             throw new Error('User type not found');
         }
         
         const token = generateToken(result.user._id, userType);
         
         // Include the user type in the response
         const userResponse = {
             ...result.user.toObject(),
             type: userType
         };
         
         res.status(200).json({ 
             success: true, 
             token, 
             user: userResponse,
             type: userType 
         });
    }
    catch(error){
        console.error('Login error:', error);
        res.status(400).json({ message: error.message });
    }
}

export const userProfile = async (req, res) => {
    try {
        // Get the user ID from the authenticated request
        const userId = req.user.id;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        
        const result = await userProfileService(userId);
        res.status(200).json(result);
    } catch (error) {
        console.error('User Profile Error:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message || 'Error fetching user profile' 
        });
    }
};