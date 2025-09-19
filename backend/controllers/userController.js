import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Car from '../models/Car.js'

//generate jwt token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })
}

//Register User
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password || password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "All Fields Are Required And Password Must Be At Least 8 Characters"
            });
        }

        //chack if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                message: "User Already Exists",
                success: false
            });
        }

        //hash the user password before saving into the database
        const hashedPassword = await bcrypt.hash(password, 10)

        //assigning the roles according to email extensions
        let role = 'user';
        if(email.endsWith('@admin.org')){
            role = 'owner'
        }

        //now create the user into database
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        })

        //when user reisters into site then a token should generate (creating a function for that before register function)
        const token = generateToken(user._id.toString());

        console.log("✅ User created, sending response:", {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
        return res.status(201).json({
            message: "User Created Successfully",
            success: true,
            token,
            user: {
                id: user._id,
                name: user?.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

//Login User
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email And Password Are Required", success: false
            })
        }

        //checking the user is available or not in databse for login
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User Not Exists", success: false
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Credentials",
                success: false
            })
        }

        const token = generateToken(user._id.toString());
        return res.status(200).json({
            message: "User Logged In Successfully",
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message })
    }
}

//get the user data using jwt
export const getuserData = async (req, res) => {
    try {
        const { user } = req;
        return res.status(200).json({
            user,
            success: true
        })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message })
    }
}

//cars list for user
export const getAllCars = async (req, res) => {
    try {
        const cars = await Car.find({ isAvailable: true });
        return res.status(200).json({
            success: true,
            cars
        })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message })
    }
}