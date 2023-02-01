import mongoose, { Schema, SchemaType } from "mongoose";

interface IActive {
  buyValue: number;
  quantBuy: number;
  name: string;
  codeName:string;
  dateTo: Date;
  dateform:string;
  user: string;
  tasks: Array<Object>
  type: string;
}
const activeSchema = new Schema({
  buyValue: {type: Schema.Types.Number, require:true},
  quantBuy: {type: Schema.Types.Number, require:true},
  dateBuy : {type: String, require:true},
  todayValue: {type: Schema.Types.Number, require:true},
  name: {type: String, require:true},
  codeName: { type:String },
  dateform:{type:String},
  dateTo: {type: String, default: Date.now, require:true },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    require:true
  },
  type: String

  
})

export default mongoose.model<IActive>('Actives', activeSchema, 'actives' )




