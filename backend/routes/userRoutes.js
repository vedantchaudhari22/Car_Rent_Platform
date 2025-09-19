import express from 'express';
import { getAllCars, getuserData, login, register } from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/data', protect, getuserData)
userRouter.get('/cars', getAllCars)


export default userRouter
