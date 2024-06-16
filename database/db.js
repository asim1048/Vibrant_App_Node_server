import mongoose from 'mongoose';



const URL=`mongodb+srv://asimm1048:mhsBnCwlOv0gYbq7@cluster0.7s1ekp7.mongodb.net/?retryWrites=true&w=majority&appName=Vibrant`;
const Connection=async()=>{
    try{
       await mongoose.connect(URL) //useUnifiedTopology means use mongoDB latest
       console.log("Database connected successfullly ")
    }catch(error){
        console.log("Error while connecting to databse: ",error.message)
    }
}

export default Connection;