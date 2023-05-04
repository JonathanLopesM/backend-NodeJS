import mongoose, { Schema, SchemaType } from "mongoose";

interface IDirectTreasure {
  buyValue2: number;
  amountNum: number;
  dateBuy: string;
  dateSell: string;
  codeName:string;
  user: string;
  type: string;
}
const DirectTreasureSchema = new Schema({
  buyValue2: {type: Schema.Types.Number, require:true},
  amountNum: {type: Schema.Types.Number, require:true},
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

export default mongoose.model<IDirectTreasure>('DirectTreasure', DirectTreasureSchema, 'directTreasure' )




