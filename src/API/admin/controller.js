import { AllUsersService, AllOrganizersService } from './service.js';

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