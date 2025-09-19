import express from "express";
import { changeBookingStatus, checkAvailabiltyOfCar, createBooking, getOwnerBookings, getUserBookings } from "../controllers/bookingController.js";
import { protect } from "../middlewares/auth.js";

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabiltyOfCar);
bookingRouter.post('/create-booking',protect, createBooking);
bookingRouter.get('/user',protect, getUserBookings);
bookingRouter.get('/owner',protect, getOwnerBookings);
bookingRouter.post('/change-status',protect, changeBookingStatus);


export default bookingRouter