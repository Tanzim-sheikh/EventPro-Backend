import { userSignupService, userLoginService } from './service.js';
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
         console.log("👉 Login Result:", result.user._id);
         
         const token = generateToken(result.user._id);
         res.status(200).json({ success: true, token, user: result.user });
    }
    catch(error){
        res.status(400).json({ message: error.message})
    }
}