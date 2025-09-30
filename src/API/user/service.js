import userModel from "../../modules/userSchema.js";
import bcrypt from "bcrypt";
import generateOTP from "../../helper/common/generateOTP.js";
import {sendOTP, ForgotPasswordUserOTP} from "../../helper/config/mailer.js";

export const userSignupService = async ({ name, email, password, profilePhoto }) => {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        throw new Error('Email already registered');
    }
    if(!name || !email || !password){
      throw new Error("Buddy fill all the Inputs !")
    }
    const otp = generateOTP();
    const user = new userModel({
         name, 
         email, 
         password,
         profilePhoto: profilePhoto || undefined,
         otp,
         otpExpiry: Date.now() + 300000
         });
    await user.save();
    return { message: 'Signup successful', user };
};

export const userLoginService = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error("Buddy, fill all the inputs!");
    }

    const userAvailable = await userModel.findOne({ email });
    if (!userAvailable) {
        throw new Error("You are not registered, buddy!");
    }

    const isMatch = await bcrypt.compare(password, userAvailable.password);
    if (!isMatch) {
        throw new Error("Bro, this is not the correct password!");
    }

    // If not verified, regenerate OTP and send it, then instruct client to verify
    if (!userAvailable.isVerified) {
        userAvailable.otp = String(generateOTP());
        userAvailable.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        await userAvailable.save();
        try {
            await sendOTP(userAvailable.email, userAvailable.otp);
        } catch (mailErr) {
            console.error("❌ Failed to send OTP (login):", mailErr?.message || mailErr);
        }
        return {
            requiresVerification: true,
            message: 'Email not verified. We have sent a verification code to your email.',
            email: userAvailable.email,
        };
    }

    return { message: "Login successful", user: userAvailable };
};

export const userProfileService = async (userId) => {
    try {
        const profile = await userModel.findById(userId).select('-password');
        if (!profile) {
            throw new Error('User not found');
        }
        return { success: true, data: profile };
    } catch (error) {
        console.error('User Profile Error:', error);
        throw new Error("Failed to fetch user profile: " + error.message);
    }
};

export const useremailVerifyService = async (email, otp) => {
    try {
      const user = await userModel.findOne({ email });

      if (!user) {
        throw new Error('User not found');
      }

      if (user.otp !== otp) {
        throw new Error('Invalid OTP');
      }

      if (user.otpExpiry < Date.now()) {
        throw new Error('OTP expired');
      }

      user.isVerified = true;
      user.otp = null;         // clear OTP
      user.otpExpiry = null;   // clear expiry
      await user.save();

      return { success: true, message: 'User verified successfully' };
    } catch (error) {
      console.error('User Email Verify Error:', error);
      throw new Error(`Failed to verify user email: ${error.message}`);
    }
  };
  
  export const userForgotPasswordService = async (email) => {
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }
      const otp = String(generateOTP());
      user.otp = otp;
      user.otpExpiry = Date.now() + 5 * 60 * 1000;
      await user.save();
      try {
        await ForgotPasswordUserOTP(user.email, otp);
      } catch (mailErr) {
        console.error("Failed to send OTP (forgot password):", mailErr?.message || mailErr);
      }
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('User Forgot Password Error:', error);
      throw new Error("Failed to send OTP (forgot password): " + error.message);
    }
  };
  
  export const userResetPasswordService = async ({ email, otp, newPassword }) => {
    try {
      if (!email || !otp || !newPassword) {
        throw new Error('Email, OTP and newPassword are required');
      }
      const user = await userModel.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }
      if (user.otp !== otp) {
        throw new Error('Invalid OTP');
      }
      if (user.otpExpiry < Date.now()) {
        throw new Error('OTP expired');
      }
      user.password = newPassword; // will be hashed by pre-save hook
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      return { success: true, message: 'Password reset successful' };
    } catch (error) {
      console.error('User Reset Password Error:', error);
      throw new Error('Failed to reset password: ' + error.message);
    }
  };