import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

const enviorment = async ()=>{
await mongoose.connect(
    //url de mongoDB
    process.env.MONGO_URL,
    {  
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
}

enviorment()
export default mongoose;