import jwt from "jsonwebtoken";

export const generateToken = (userId, userType) => {
    return jwt.sign(
        { id: userId, type: userType },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};
