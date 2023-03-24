import mongoose, { Schema, SchemaType } from "mongoose";

interface ISpread {
  amount: number;
  description: string;
  category:string;
  dateTo: Date;
  dateform:string;
  user: string;
  tasks: Array<Object>
  type: string;
}

interface ISpreads extends Array<ISpread>{}

const spreadSheetSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    require:true
  },
  type: String,
  spread: [{
    amount: {type: Schema.Types.Number, require:true},
    description: {type: String, require:true},
    category: { type:String },
    dateform:{type:String},
    dateTo: {type: String, default: Date.now, require:true },
  }]

  
})

export default mongoose.model<ISpreads>('SpreadSheet', spreadSheetSchema, 'spreadsheet' )




