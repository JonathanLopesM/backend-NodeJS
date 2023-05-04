import mongoose, { Schema, SchemaType } from "mongoose";
interface IStockModel {
  
  buyValue: number;
  amountBuy: number;
  dateBuy: string;
  codeName:string;
  category: string;
  type: string;
  priceWhenBuy: number;
  percentWhenBuy:number;
  user: string;
  
}
const stockModelSchema = new Schema({
  
  buyValue: {type: Schema.Types.Number, require:true},
  amountBuy: {type: Schema.Types.Number, require:true},
  dateBuy: {type: String, require:true},
  codeName: { type:String },
  category: { type:String },
  type: { type:String },
  priceWhenBuy: { type: Schema.Types.Number, require:true},
  percentWhenBuy: { type: Schema.Types.Number, require:true},
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    require:true
  }
})

export default mongoose.model<IStockModel>('StockModel', stockModelSchema, 'stockmodel' )




