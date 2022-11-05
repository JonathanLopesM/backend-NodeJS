import mongoose, { Schema } from "mongoose";

interface IUser {
  name:string;
  email:string;
  password:string;
}
const userSchema = new Schema({
  name: {type: String},
  email: {type: String},
  password: String,
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  }
})

export default mongoose.model<IUser>('User', userSchema )




