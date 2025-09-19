import express from "express";
import { protect } from "../middlewares/auth.js";
import { changeRoleToOwner, deleteCar, getDashboardData, getOwnerCars, listCar, toggleCarAvailability, updateUserImage } from "../controllers/ownerController.js";
import upload from "../middlewares/multer.js";

const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner);
ownerRouter.post("/add-car",protect, upload.single("image"), listCar);
ownerRouter.get("/cars", protect, getOwnerCars);
ownerRouter.post("/toggle-car", protect, toggleCarAvailability);
ownerRouter.post("/delete-car", protect, deleteCar);

ownerRouter.get('/dashboard', protect, getDashboardData);
ownerRouter.post('/update-image', protect, upload.single("image"), updateUserImage);

export default ownerRouter