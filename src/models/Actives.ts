import mongoose, { Schema, SchemaType } from "mongoose";

interface IActive {
  buyValue: number;
  amountBuy: number;
  codeName:string;
  dateTo: Date;
  dateform:string;
  user: string;
  tasks: Array<Object>
  category: string;
}
const activeSchema = new Schema({
  buyValue: {type: Schema.Types.Number, require:true},
  amountBuy: {type: Schema.Types.Number, require:true},
  dateBuy : {type: String, require:true},
  todayValue: {type: Schema.Types.Number, require:true},
  codeName: { type:String },
  category: { type:String },
  dateform:{type:String},
  dateTo: {type: String, default: Date.now, require:true },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    require:true
  },

  
})

export default mongoose.model<IActive>('Actives', activeSchema, 'actives' )




