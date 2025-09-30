import userModel from "../../modules/userSchema.js";
import OrganizerSchema from "../../modules/OrganiSchema.js"


export const AllUsersService = async () =>{
    try{
        const allusers = await userModel.find({ type: { $ne: "admin" } });
        
        return {success: true, data: allusers};
    }
    catch(error){
        console.error('All Users Error:', error);
        throw new Error("Failed to fetch all users: " + error.message);
    }
}

export const AllOrganizersService = async () =>{
    try{
         const allorganizers = await OrganizerSchema.find();
         return{success: true, data: allorganizers}
    }
    catch(error){
        console.error('All Organizers Error:', error);
        throw new Error("Failed to fetch all organizers:" + error.message)
    }
}

export const NotVerifiedOrganizersService = async () =>{
    try{
         const notverifiedorganizers = await OrganizerSchema.find({ isVerifiedByAdmin: false });
         return{success: true, data: notverifiedorganizers}
    }
    catch(error){
        console.error('Not Verified Organizers Error:', error);
        throw new Error("Failed to fetch not verified organizers:" + error.message)
    }
}

export const verifyOrganizerService = async (id) => {
    try {
        const organizer = await OrganizerSchema.findById(id);
        if (!organizer) {
            throw new Error("Organizer not found");
        }
      
        organizer.isVerifiedByAdmin = true;
        await organizer.save();
        return organizer;
    } catch (error) {
        console.error('Verify Organizer Service Error:', error);
        throw new Error("Failed to verify organizer: " + error.message);
    }
};
export const rejectOrganizerService = async (id) => {
    try {
        const organizer = await OrganizerSchema.findById(id);
        if (!organizer) {
            throw new Error("Organizer not found");
        }
      
        // 👇 reject hone par document delete karna ho to
        await OrganizerSchema.findByIdAndDelete(id);
      
        return organizer; // delete hone ke baad bhi email ke liye purana data mil jayega
    } catch (error) {
        console.error('Reject Organizer Service Error:', error);
        throw new Error("Failed to reject organizer: " + error.message);
    }
};