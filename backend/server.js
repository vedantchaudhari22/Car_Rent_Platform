import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './config/db.js';
import userRouter from './routes/userRoutes.js';
import ownerRouter from './routes/ownerRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';


const app = express();
app.use(cors())
app.use(express.json()); // <-- this parses JSON bodies
app.use(express.urlencoded({ extended: true })); // <-- parses form data

app.get('/', (req, res)=> res.send("Server Is Running"));
app.use('/api/user', userRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/bookings',bookingRouter);

const PORT = process.env.PORT || 3000
app.listen(PORT, (req, res) => console.log(`Server s Running On Port ${PORT}`)
);

await connectDB();




