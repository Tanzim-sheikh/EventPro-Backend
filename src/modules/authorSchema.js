import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const authorSchema = new Schema({
    Name:{type:String, required:true},
    surname:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    phoneNumber:{type:String, required:true},
    dateOfBirth:{type:Date, required:true},
    gender:{type:String, required:true}
})

// password hash middleware
authorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// compare password method
authorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const authorModel = mongoose.model("authorSchema", authorSchema);

export default userModel;