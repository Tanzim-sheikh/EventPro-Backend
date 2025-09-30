import { userSignupService, userLoginService, userProfileService, useremailVerifyService, userForgotPasswordService, userResetPasswordService } from './service.js';
import { generateToken } from '../../helper/common/jwtToken.js';
import {sendOTP,WelcomUserEmail} from '../../helper/config/mailer.js';
import { uploadBufferToCloudinary } from '../../helper/config/cloudinaryUpload.js';



export const userSignup = async (req, res) => {
  try {
    console.log("👉 Received Body:", req.body);
    // If profile photo file is present, upload to Cloudinary first
    let profilePhoto = undefined;
    if (req.file?.buffer) {
      try {
        const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'app/uploads/users/profile');
        profilePhoto = { url: uploaded.secure_url, public_id: uploaded.public_id };
      } catch (err) {
        console.error('Cloudinary upload failed (user profile):', err?.message || err);
        return res.status(400).json({ success: false, message: 'Profile photo upload failed' });
      }
    }

    const result = await userSignupService({ ...req.body, profilePhoto });

    // Fire-and-forget OTP email; do not block signup if email fails
    try {
      await sendOTP(req.body.email, result.user.otp);
      console.log("✅ OTP sent to:", req.body.email);
    } catch (mailErr) {
      console.error("❌ Failed to send OTP:", mailErr?.message || mailErr);
    }
     
    setTimeout(()=>{
      WelcomUserEmail(req.body.email,req.body.Name)
    },30000)
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error?.message || "Signup Failed" });
  }
}

export const userLogin = async (req, res) => {
    try {
         const result = await userLoginService(req.body);
         if (result?.requiresVerification) {
             return res.status(200).json({
                 success: false,
                 requiresVerification: true,
                 message: result.message,
                 email: result.email
             });
         }
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

export const useremailVerify = async (req, res) => {
  try {
    const { email, otp } = req.body;   // frontend se aayega
    const result = await useremailVerifyService(email, otp);
    res.status(200).json(result);
  } catch (error) {
    console.error('User Email Verify Error:', error);
    res.status(400).json({ message: error.message });
  }
};

export const userForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await userForgotPasswordService(email);
        res.status(200).json(result);
    } catch (error) {
        console.error('User Forgot Password Error:', error);
        res.status(400).json({ message: error.message });
    }
}

export const userResetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const result = await userResetPasswordService({ email, otp, newPassword });
        res.status(200).json(result);
    } catch (error) {
        console.error('User Reset Password Error:', error);
        res.status(400).json({ message: error.message });
    }
}
    