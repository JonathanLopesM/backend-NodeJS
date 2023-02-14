import mongoose, { Schema, SchemaType } from "mongoose";

interface ITax {
  annualIncomeCorrect: number;
  healthCorrect: number;
  dependentsCorrect: number;
  spendingOnEducation: number;
  Alimony:number;
  ContributionPGBL: number;
  INSS: number;
  withholdingTax: number;
  FirstAliquot: number, 
  SecondAliquot: number, 
  ThirdAliquot: number, 
  FourAliquot: number, 
  FiveAliquot:number,
  taxTotal: number,
  BalanceRefounded:number, 
  PercentBalanceRefounded: number,
  NewTaxBase: number, 
  taxFirst: number, 
  taxSecond: number,
  TaxThirdRate:number,
  TaxFourRate:number, 
  TaxFiveRate:number,
  EducationCalc: number,
  PGBLCalc:number,
  TotalDedution:number;
  CorrectAliquot: string;
  AliquoteEffect: number;
  
  dateTo: Date;
  dateform:string;
  user: string;
  tasks: Array<Object>
  type: string;
}
const taxSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    require:true
  },
  annualIncomeCorrect: {type: Schema.Types.Number, require:true},
  healthCorrect: {type: Schema.Types.Number, require:true},
  dependentsCorrect: { type:Schema.Types.Number },
  spendingOnEducation: {type: Schema.Types.Number},
  Alimony : {type: Schema.Types.Number},
  ContributionPGBL: {type: Schema.Types.Number},
  INSS: {type: Schema.Types.Number},
  withholdingTax: {type: Schema.Types.Number},
  FirstAliquot: {type: Schema.Types.Number}, 
  SecondAliquot: {type: Schema.Types.Number}, 
  ThirdAliquot: {type: Schema.Types.Number}, 
  FourAliquot: {type: Schema.Types.Number}, 
  FiveAliquot: {type: Schema.Types.Number},
  taxTotal: {type: Schema.Types.Number}, 
  BalanceRefounded: {type: Schema.Types.Number},
  PercentBalanceRefounded:{type: Schema.Types.Number},
  NewTaxBase: {type: Schema.Types.Number}, 
  taxFirst: {type: Schema.Types.Number}, 
  taxSecond: {type: Schema.Types.Number},
  TaxThirdRate:{type: Schema.Types.Number},
  TaxFourRate:{type: Schema.Types.Number}, 
  TaxFiveRate:{type: Schema.Types.Number},
    EducationCalc: {type: Schema.Types.Number},
    PGBLCalc: {type: Schema.Types.Number},
  TotalDedution: {type: Schema.Types.Number},
  dependentsCalc: {type: Schema.Types.Number},
  CorrectAliquot: {type:String},
  AliquoteEffect:{type: Schema.Types.Number},
  
  dateform:{type:String},
  dateTo: {type: String, default: Date.now, require:true },
  
  type: String

  
})

export default mongoose.model<ITax>('Taxs', taxSchema, 'taxs' )




