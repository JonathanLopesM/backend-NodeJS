import mongoose, { Schema, SchemaType } from "mongoose";

interface ITax {
  annualIncome: number;
  health: number;
  dependents: number;
  spendingOnEducation: number;
  ContributionPGBL: number;
  INSS: number;
  withholdingTax: number;
  dateTo: Date;
  dateform:string;
  user: string;
  tasks: Array<Object>
  type: string;
}
const taxSchema = new Schema({
  annualIncome: {type: Schema.Types.Number, require:true},
  health: {type: Number, require:true},
  dependents: { type:Number },
  spendingOnEducation: {type: Number},
  ContributionPGBL: {type: Number},
  INSS: {type: Number},
  withholdingTax: {type: Number},
  dateform:{type:String},
  dateTo: {type: String, default: Date.now, require:true },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    require:true
  },
  type: String

  
})

export default mongoose.model<ITax>('Taxs', taxSchema, 'taxs' )




