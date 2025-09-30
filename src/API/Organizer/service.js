import OrganizerSchema from "../../modules/OrganiSchema.js";
import Event from "../../modules/EventsSchema.js";
import generateOTP from "../../helper/common/generateOTP.js";
import {sendOTP, ForgotPasswordOrganizerOTP} from "../../helper/config/mailer.js";

export const OrganizerSignupService = async ({ Name, surname, email, password, phoneNumber, gender, dateOfBirth, profilePhoto, aadharDoc, panDoc, gstDoc }) => {
    try {
        // Check if organizer already exists
        const existingOrganizer = await OrganizerSchema.findOne({ email });
        if (existingOrganizer) {
            throw new Error('An account with this email already exists');
        }

        // Create new organizer
        const organizer = new OrganizerSchema({
            Name,
            surname,
            email,
            password,
            phoneNumber,
            gender,
            dateOfBirth: new Date(dateOfBirth),
            // Cloudinary uploads (optional)
            profilePhoto: profilePhoto || undefined,
            aadharDoc: aadharDoc || undefined,
            panDoc: panDoc || undefined,
            gstDoc: gstDoc || undefined,
            // OTP for email verification
            otp: String(generateOTP()),
            otpExpiry: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        });

        // Save organizer to database
        await organizer.save();

        // Return organizer data (password is automatically removed by the schema's toJSON method)
        return {
            success: true,
            message: 'Registration successful',
            organizer
        };
    } catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
};

export const OrganizerResetPasswordService = async ({ email, otp, newPassword }) => {
    try {
        if (!email || !otp || !newPassword) {
            throw new Error('Email, OTP and newPassword are required');
        }
        const organizer = await OrganizerSchema.findOne({ email });
        if (!organizer) {
            throw new Error('Organizer not found');
        }
        if (organizer.otp !== otp) {
            throw new Error('Invalid OTP');
        }
        if (new Date() > organizer.otpExpiry) {
            throw new Error('OTP expired');
        }
        organizer.password = newPassword; // hashed by pre-save hook
        organizer.otp = undefined;
        organizer.otpExpiry = undefined;
        await organizer.save();
        return { success: true, message: 'Password reset successful' };
    } catch (error) {
        console.error('Organizer Reset Password Error:', error);
        throw new Error('Failed to reset password: ' + (error?.message || error));
    }
};

export const OrganizerLoginService = async ({ email, password }) => {
    try {
        // Find organizer by email
        const organizer = await OrganizerSchema.findOne({ email });
        if (!organizer) {
            throw new Error('Invalid email or password');
        }
    
        // Check password
        const isMatch = await organizer.matchPassword(password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        // If not verified, regenerate OTP and send it, then instruct client to verify
        if (!organizer.isVerified) {
            organizer.otp = String(generateOTP());
            organizer.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
            await organizer.save();
            try {
                await sendOTP(organizer.email, organizer.otp);
            } catch (mailErr) {
                console.error("Failed to send Organizer OTP (login):", mailErr?.message || mailErr);
            }
            return {
                requiresVerification: true,
                message: 'Email not verified. We have sent a verification code to your email.',
                email: organizer.email,
            };
        }
        if(!organizer.isVerifiedByAdmin){
            throw new Error('Your account is not verified by admin Please try Again after some Time.');
        }

        // Return organizer data (password is automatically removed by the schema's toJSON method)
        return {
            success: true,
            message: 'Login successful',
            organizer: {
                _id: organizer._id,
                Name: organizer.Name,
                surname: organizer.surname,
                email: organizer.email,
                phoneNumber: organizer.phoneNumber,
                type: organizer.type,
                createdAt: organizer.createdAt
            }
        };
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const OrganizerProfileService = async (organizerId) => {
    try {
        const organizer = await OrganizerSchema.findById(organizerId).select('-password');
        if (!organizer) {
            throw new Error('Organizer not found');
        }
        return { success: true, data: organizer };
    } catch (error) {
        console.error('Organizer Profile Error:', error);
        throw new Error("Failed to fetch organizer profile: " + error.message);
    }
};

export const OrganizerEmailVerifyService = async (email, otp) => {
    try {
        const organizer = await OrganizerSchema.findOne({ email });
        if (!organizer) {
            throw new Error('Organizer not found');
        }
        if (organizer.otp !== otp) {
            throw new Error('Invalid OTP');
        }
        if (new Date() > organizer.otpExpiry) {
            throw new Error('OTP expired');
        }
        organizer.isVerified = true;
        organizer.otp = undefined;
        organizer.otpExpiry = undefined;
        await organizer.save();
        return { success: true, message: 'Organizer verified successfully' };
    } catch (error) {
        console.error('Organizer Email Verify Error:', error);
        throw error;
    }
}

export const OrganizerForgotPasswordService = async (email) => {
    try {
        const organizer = await OrganizerSchema.findOne({ email });
        if (!organizer) {
            throw new Error('Organizer not found');
        }
        const otp = String(generateOTP());
        organizer.otp = otp;
        organizer.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        await organizer.save();
        try {
            await ForgotPasswordOrganizerOTP(organizer.email, otp);
        } catch (mailErr) {
            console.error("Failed to send Organizer OTP (forgot password):", mailErr?.message || mailErr);
        }
        return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
        console.error('Organizer Forgot Password Error:', error);
        throw new Error("Failed to send OTP (forgot password): " + (error?.message || error));
    }
};

export const OrganizerCreateEventService = async (organizerId, payload) => {
    try {
        const organizer = await OrganizerSchema.findById(organizerId);
        if (!organizer) {
            throw new Error('Organizer not found');
        }
        // Map incoming payload to EventsSchema fields
        const {
            eventName,
            date,
            time,
            city,
            address,
            organizerName, // optional; we'll prefer organizer.Name for integrity
            tickets,
            price,
            description,
            status,
        } = payload || {};

        // Basic validations for required fields per EventsSchema
        const missing = [];
        if (!eventName) missing.push('eventName');
        if (!date) missing.push('date');
        if (!time) missing.push('time');
        if (!city) missing.push('city');
        if (!address) missing.push('address');
        if (tickets === undefined) missing.push('tickets');
        if (price === undefined) missing.push('price');
        if (!description) missing.push('description');
        if (missing.length) {
            throw new Error(`Missing required fields: ${missing.join(', ')}`);
        }

        const eventDoc = await Event.create({
            eventName,
            date: new Date(date),
            time,
            city,
            address,
            organizerName: organizerName || organizer.Name,
            tickets,
            price,
            description,
            createdBy: organizer._id,
            ...(status ? { status } : {}),
        });

        return { success: true, message: 'Event created successfully', data: eventDoc };
    } catch (error) {
        console.error('Organizer Create Event Error:', error);
        throw error;
    }
};