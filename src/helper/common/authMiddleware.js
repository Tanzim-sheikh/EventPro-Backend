import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            type: decoded.type // Add user type to the request object
        };
        next();
    } catch (error) {
        console.error('JWT Error:', error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Authorization middleware to check user type
export const authorize = (...types) => {
    return (req, res, next) => {
        if (!types.includes(req.user?.type)) {
            return res.status(403).json({ 
                message: `User role ${req.user?.type} is not authorized to access this route` 
            });
        }
        next();
    };
};
