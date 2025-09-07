import userModel from "../../modules/userSchema.js";
import bcrypt from "bcrypt"
import { generateToken } from "../../helper/common/jwtToken.js";
export const userSignupService = async ({ name, email, password }) => {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        throw new Error('Email already registered');
    }
    if(!name || !email || !password){
      throw new Error("Buddy fill all the Inputs !")
    }
    const user = new userModel({ name, email, password });
    await user.save();
    return { message: 'Signup successful' };
}

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

    return { message: "Login successful", user: userAvailable };
};
