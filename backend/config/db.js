import mongoose from "mongoose";

const connectDB = async() => {
    try {
        mongoose.connection.on('connected', ()=> console.log("DB Connected")
        )
        await mongoose.connect(`${process.env.MONGODB_URI}CarRental`)
    } catch (error) {
        console.error(error.message);
    }
}

export default connectDB