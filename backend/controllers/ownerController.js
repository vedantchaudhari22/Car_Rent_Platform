import imagekit from "../config/imageKit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";

//change the role from user to owner
export const changeRoleToOwner = async (req, res) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { role: "owner" })
        return res.status(201).json({
            success: true,
            message: "Now You Can List Cars"
        })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//List the car
export const listCar = async (req, res) => {
    try {
        const { _id } = req.user;
        let car = JSON.parse(req.body.carData);
        const imageFile = req.file;

        //upload image to image kit
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/cars'
        })

        // For URL Generation, works for both images and videos
        var optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: '1280' },
                { quality: 'auto' },
                { format: 'webp' }
            ]
        });

        const image = optimizedImageUrl;
        await Car.create({
            ...car, owner: _id, image
        })

        return res.status(200).json({
            success: true,
            message: "Car Added Successfully"
        })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


//get the list of owner cars
export const getOwnerCars = async (req, res) => {
    try {
        const { _id } = req.user;
        const cars = await Car.find({ owner: _id })

        return res.status(200).json({
            success: true,
            message: "Cars Fetched Successfully",
            cars
        })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//Toggle Car Availability
export const toggleCarAvailability = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body
        const car = await Car.findById(carId);

        //Checking if the car belongs to the user
        if (car.owner.toString() !== _id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized"
            })
        }

        car.isAvailable = !car.isAvailable;
        await car.save();

        return res.status(200).json({
            success: true,
            message: "Availability Toggled Successfully"
        })

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//Owner can delete their car
export const deleteCar = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body
        const car = await Car.findById(carId);

        //Checking if the car belongs to the user
        if (car.owner.toString() !== _id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized"
            })
        }

        car.owner = null;
        car.isAvailable = false;
        await car.save();

        return res.status(200).json({
            success: true,
            message: "Car Removed Successfully"
        })

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//get dashboard data
export const getDashboardData = async (req, res) => {
    try {
        const { _id, role } = req.user;
        if (role !== "owner") {
            return res.status(400).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const cars = await Car.find({ owner: _id });
        const bookings = await Booking.find({ owner: _id }).populate('car').sort({ createdAt: -1 });

        //pending bookings data
        const pendingBookings = await Booking.find({ owner: _id, status: "pending" });

        //completed bookings data
        const confiremdBookings = await Booking.find({ owner: _id, status: "confirmed" });

        //monthly revenue
        const monthlyRevenue = bookings.slice().filter(booking => booking.status === 'confirmed').reduce((acc, booking) => acc + booking.price, 0);

        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: confiremdBookings.length,
            recentBookings: bookings.slice(0, 3),
            monthlyRevenue
        }

        return res.status(200).json({
            success: true,
            dashboardData
        })

    } catch (error) {
        console.error("getDashboardData error",error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//update the user profile image
export const updateUserImage = async (req, res) => {
    try {
        const { _id } = req.user;
        const imageFile = req.file;

        //upload image to image kit
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/users'
        })

        // For URL Generation, works for both images and videos
        var optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: '400' },
                { quality: 'auto' },
                { format: 'webp' }
            ]
        });

        const image = optimizedImageUrl;
        await User.findByIdAndUpdate(_id, {image});
        return res.status(200).json({
            success: true,
            message: "Image Updated Successfully"
        })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
