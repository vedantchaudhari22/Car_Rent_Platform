import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token, not authorized",
        });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

        // Find the user by ID from token
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Attach user to request object
        req.user = user;

        next();
    } catch (error) {
        console.error(error.message);
        return res.status(401).json({
            success: false,
            message: "Token verification failed",
        });
    }
};
