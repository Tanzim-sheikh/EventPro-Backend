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