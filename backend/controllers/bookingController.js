import Booking from "../models/Booking.js"
import Car from "../models/Car.js";


//find the availability of a car on given date
const checkAvailability = async (car, pickupDate, returnDate) => {
    const bookings = await Booking.find({
        car,
        pickupDate: { $lte: returnDate },
        returnDate: { $gte: pickupDate }
    })
    return bookings.length === 0; //
}

//check availability of cars for the given data and location
export const checkAvailabiltyOfCar = async (req, res) => {
    try {
        const { location, pickupDate, returnDate } = req.body;

        //fetch all available car for given location
        const cars = await Car.find({ location, isAvailable: true });

        //check car availability for the given date using primise
        const availableCarsPromise = cars.map(async (car) => {
            const isAvailable = await checkAvailability(car._id, pickupDate, returnDate);

            return { ...car._doc, isAvailable: isAvailable }
        })

        let availableCars = await Promise.all(availableCarsPromise);

        availableCars = availableCars.filter(car => car.isAvailable === true);

        return res.status(200).json({
            success: true,
            availableCars
        })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Create Booking for a car
export const createBooking = async (req, res) => {
    try {
        const { _id } = req.user;
        const { car, pickupDate, returnDate } = req.body;
        const isAvailable = await checkAvailability(car, pickupDate, returnDate);

        if (!isAvailable) {
            return res.status(400).json({
                success: false,
                message: "Car Is Not Available"
            })
        }

        const carData = await Car.findById(car);

        //calculate price based on pickup and return date
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const noofDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));

        const price = carData.pricePerDay * noofDays;

        await Booking.create({
            car,
            owner: carData.owner,
            user: _id,
            pickupDate,
            returnDate,
            price
        })
        return res.status(200).json({
            success: true,
            message: "Booking Created Successfully"
        })

    } catch (error) {
        console.error("Create booking error",error.message || "Create Booking error");
        return res.status(500).json({
            success: false,
            message: "CREATE BOOKING ERROR"
        })
    }
}

//list of bookings for user
export const getUserBookings = async (req, res) => {
    try {
        const { _id } = req.user;
        const bookings = await Booking.find({ user: _id }).populate("car").sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            bookings
        })
    } catch (error) {
        console.error("Get car Bookings Error",error.message || "Car Not Available");
        return res.status(500).json({
            success: false,
            message: error.message || "CAR NOT AVAILABLE"
        })
    }
}

//get the list of bookings for owner
export const getOwnerBookings = async (req, res) => {
    try {
        if (req.user.role !== 'owner') {
            return res.status(400).json({
                success: false,
                message: "Unauthorized"
            })
        }
        const bookings = await Booking.find({ owner: req.user._id }).populate('car user').select("-user.password").sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            bookings
        })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//change the booking status by owner
export const changeBookingStatus = async (req, res) => {
    try {
        const { _id } = req.user;
        const { bookingId, status } = req.body;
        const booking = await Booking.findById(bookingId);

        if (booking.owner.toString() !== _id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Unauhtorized"
            })
        }
        booking.status = status;
        await booking.save();

        return res.status(200).json({
            success: true,
            message: "Booking Status Updated Successfully"
        })

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}