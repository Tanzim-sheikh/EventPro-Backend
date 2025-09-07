import mongoose from 'mongoose'

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Hmmm! DB Connected Buddy")
}
catch(error){
  console.log(error,"Not able to connect with DB")
}
}

export default connectDB