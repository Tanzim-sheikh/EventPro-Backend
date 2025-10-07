import { OrganizerSignupService, OrganizerLoginService,
     OrganizerProfileService, OrganizerEmailVerifyService,
      OrganizerForgotPasswordService, OrganizerResetPasswordService } from "./service.js";
import { generateToken } from "../../helper/common/jwtToken.js";
import {sendOTP, WelcomOrganizerOTP} from "../../helper/config/mailer.js"
import { uploadBufferToCloudinary } from '../../helper/config/cloudinaryUpload.js';

export const OrganizerSignup = async (req, res) => {
    try {
        console.log("Organizer Signup Request:", { email: req.body.email });

        // Upload files to Cloudinary if present
        const files = req.files || {};
        const uploads = {};

        const tasks = [];
        const maybePush = (key, fileArr, folder) => {
            if (Array.isArray(fileArr) && fileArr[0]?.buffer) {
                tasks.push(
                    uploadBufferToCloudinary(fileArr[0].buffer, folder)
                        .then(r => { uploads[key] = { url: r.secure_url, public_id: r.public_id }; })
                );
            }
        };

        maybePush('profilePhoto', files.profilePhoto, 'app/uploads/organizers/profile');
        maybePush('aadharDoc', files.aadharDoc, 'app/uploads/organizers/aadhar');
        maybePush('panDoc', files.panDoc, 'app/uploads/organizers/pan');
        maybePush('gstDoc', files.gstDoc, 'app/uploads/organizers/gst');

        if (tasks.length) {
            try {
                await Promise.all(tasks);
            } catch (err) {
                console.error('Cloudinary upload failed (organizer docs):', err?.message || err);
                return res.status(400).json({ success: false, message: 'Document upload failed' });
            }
        }

        const payload = { ...req.body, ...uploads };
        const result = await OrganizerSignupService(payload);
        
        // Send the persisted OTP to the organizer's email
        await sendOTP(result.organizer.email, result.organizer.otp);
        console.log("✅ OTP sent to:", result.organizer.email);
        
        res.status(201).json({
            success: true,
            message: result.message,
            organizer: result.organizer
        });

       setTimeout(()=>{
        WelcomOrganizerOTP(result.organizer.email,result.organizer.Name)
       },30000) 
    } catch (error) {
        console.error("Organizer Signup Error:", error);
        const statusCode = error.message.includes('already exists') ? 409 : 400;
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Registration failed. Please try again.'
        });
    }
};

export const OrganizerLogin = async (req, res) => {
    try {
        console.log("Organizer Login Attempt:", { email: req.body.email });
        
        const result = await OrganizerLoginService(req.body);
        if (result?.requiresVerification) {
            return res.status(200).json({
                success: false,
                requiresVerification: true,
                message: result.message,
                email: result.email
            });
        }
        const token = generateToken(
            result.organizer._id, 
            result.organizer.type || 'organizer'
        );
        
        res.status(200).json({
            success: true,
            message: result.message,
            token,
            organizer: result.organizer,
            type: result.organizer.type || 'organizer'
        });
    } catch (error) {
        console.error("Organizer Login Error:", error);
        res.status(401).json({
            success: false,
            message: error.message || 'Authentication failed. Please check your credentials.'
        });
    }
};

export const OrganizerProfile = async (req, res) => {
    try {
        const organizerId = req.user?.id;
        if (!organizerId) {
            return res.status(401).json({ success: false, message: 'Organizer not authenticated' });
        }
        const result = await OrganizerProfileService(organizerId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Organizer Profile Error:', error);
        res.status(400).json({ success: false, message: error.message || 'Error fetching organizer profile' });
    }
};

// export const OrganizerCreateEvents = async (req, res) =>{
//     try{
//        const organizerId = req.user?.id;
//        if(!organizerId){
//         return res.status(401).json({sucess: false, message: 'Organizer not authenticated'});
//        }
//        const result = await OrganizerCreateEventsService(organizerId);
//     }
//     catch(erro){

//     }
// }

export const OrganizerEmailVerify = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const result = await OrganizerEmailVerifyService(email, otp);
        res.status(200).json(result);
    } catch (error) {
        console.error('Organizer Email Verify Error:', error);
        res.status(400).json({ message: error.message });
    }
};

export const OrganizerForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await OrganizerForgotPasswordService(email);
        res.status(200).json(result);
    } catch (error) {
        console.error('Organizer Forgot Password Error:', error);
        res.status(400).json({ message: error.message });
    }
};
export const OrganizerResetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const result = await OrganizerResetPasswordService({ email, otp, newPassword });
        res.status(200).json(result);
    } catch (error) {
        console.error('Organizer Reset Password Error:', error);
        res.status(400).json({ message: error.message });
    }
};
