import mongoose, { Schema, SchemaType } from "mongoose";

interface IPatrimony {
  amount: number;
  description: string;
  category:string;
  dateTo: Date;
  dateform:string;
  user: string;
  tasks: Array<Object>
  type: string;
}
const patrimonySchema = new Schema({
  amount: {type: Schema.Types.Number, require:true},
  description: {type: String, require:true},
  category: { type:String },
  dateform:{type:String},
  dateTo: {type: String, default: Date.now, require:true },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    require:true
  },
  type: String

  
})

export default mongoose.model<IPatrimony>('Patrimonys', patrimonySchema, 'patrimonys' )




