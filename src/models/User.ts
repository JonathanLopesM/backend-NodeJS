import mongoose, { Schema } from "mongoose";

interface IUser {
  name:string;
  email:string;
  password:string;
  active:number;
  statement: Array<Object>;
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
  },
  active: {type: Number},
  statement: [
    {
      description: String,
      amount: Number,
      type: Schema.Types.ObjectId,
      ref:"Amounts"
    }
  ]
})

export default mongoose.model<IUser>('Users', userSchema, 'users' )




