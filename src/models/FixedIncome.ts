import mongoose, { Schema, SchemaType } from "mongoose";

interface IFixedIncome {
  buyValue2: number;
  percentAmount: number;
  dateBuy: string;
  dateSell: string;
  codeName:string;
  user: string;
  type: string;
}
const fixedIncomeSchema = new Schema({
  buyValue2: {type: Schema.Types.Number, require:true},
  percentAmount: {type: Schema.Types.Number, require:true},
  dateBuy : {type: String, require:true},
  dateSell:{type:String},
  codeName: { type:String },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    require:true
  },
  type: String
})

export default mongoose.model<IFixedIncome>('FixedIncome', fixedIncomeSchema, 'fixedIncome' )




