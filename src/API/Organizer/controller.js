import { OrganizerSignupService, OrganizerLoginService, OrganizerProfileService } from "./service.js";
import { generateToken } from "../../helper/common/jwtToken.js";

export const OrganizerSignup = async (req, res) => {
    try {
        console.log("Organizer Signup Request:", { email: req.body.email });
        const result = await OrganizerSignupService(req.body);
        
        res.status(201).json({
            success: true,
            message: result.message,
            organizer: result.organizer
        });
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

export const OrganizerCreateEvents = async (req, res) =>{
    try{
       const organizerId = req.user?.id;
       if(!organizerId){
        return res.status(401).json({sucess: false, message: 'Organizer not authenticated'});
       }
       const result = await OrganizerCreateEventsService(organizerId);
    }
    catch(erro){

    }
}
