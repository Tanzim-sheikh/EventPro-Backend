import { AllUsersService, AllOrganizersService, NotVerifiedOrganizersService, verifyOrganizerService, rejectOrganizerService } from './service.js';
import {VerifiedOrganizer, RejectedOrganizer} from '../../helper/config/mailer.js';
export const AllUsers = async (req, res) =>{
    try{
        const allusers = await AllUsersService();
        res.status(200).json(allusers);
    }
    catch(error){
        console.error('All Users Error:', error);
        res.status(400).json({success: false, message: error.message || 'Error fetching all users'});
    }
}

export const AllOrganizers = async (req, res)=>{
    try{
        const allorganizers = await AllOrganizersService();
        res.status(200).json(allorganizers);
    }
    catch(error){
      console.error("All Organizer Error:", error);
      res.status(400).json({success: false, message:error.message || 'Error fetching all Organizers'});
    }
}

export const NotVerifiedOrganizers = async (req, res)=>{
    try{
        const notverifiedorganizers = await NotVerifiedOrganizersService();
        res.status(200).json(notverifiedorganizers);
    }
    catch(error){
      console.error("Not Verified Organizer Error:", error);
      res.status(400).json({success: false, message:error.message || 'Error fetching not verified organizers'});
    }
}

export const VerifyOrganizer = async (req, res)=>{
    try{
        const id= req.params.id
        const verifyorganizer = await verifyOrganizerService(id);
        await VerifiedOrganizer(verifyorganizer.email, verifyorganizer.Name);
        res.status(200).json({success: true, message: 'Organizer verified successfully', data: verifyorganizer});
    }
    catch(error){
      console.error("Verify Organizer Error:", error);
      res.status(400).json({success: false, message:error.message || 'Error verifying organizer'});
    }
}

export const RejectOrganizer = async (req, res)=>{
    try{
        const id = req.params.id
        const rejectorganizer = await rejectOrganizerService(id);
        await RejectedOrganizer(rejectorganizer.email, rejectorganizer.Name);
        res.status(200).json({success: true, message: 'Organizer rejected successfully', data: rejectorganizer});
    }
    catch(error){
      console.error("Reject Organizer Error:", error);
      res.status(400).json({success: false, message:error.message || 'Error rejecting organizer'});
    }
}
