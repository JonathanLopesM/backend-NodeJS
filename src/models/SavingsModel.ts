import mongoose, { Schema, SchemaType } from "mongoose";

interface ISavings {
  buyValue2: number;
  dateBuy: string;
  codeName:string;
  user: string;
  type: string;
}
const SavingsSchema = new Schema({
  buyValue2: {type: Schema.Types.Number, require:true},
  dateBuy : {type: String, require:true},
  codeName: { type:String },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    require:true
  },
  type: String
})

export default mongoose.model<ISavings>('Savings', SavingsSchema, 'savings' )




