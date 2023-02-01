import mongoose, { Schema, SchemaType } from "mongoose";

interface IProjectLife {
  yearOld: number;
  retirement: number;
  ExpectLife: number;
  ValueMonth: number;
  montanteInit: number;
  RetireValue: number;
  tempoM: number;
  tempoApose: number;
  INSSproject: number;
  otherSourcesFinal: number;
  taxaM: number;
  taxaNumber: number;
  montante: number;
  ValueApos: number;
  idadeMilion: number;
  totalAmountInit: number;
  gainAmountInit: number ;
  tenYears: number;
  PortionMin:number;
  PortionNegative: number;
  user: string;
  type: string;
}
const projectLifeSchema = new Schema({
  yearOld: {type: Schema.Types.Number, require:true},
  retirement: {type: Schema.Types.Number, require:true},
  ExpectLife: {type: Schema.Types.Number, require:true},
  ValueMonth: {type: Schema.Types.Number, require:true},
  montanteInit: {type: Schema.Types.Number, require:true},
  RetireValue: {type: Schema.Types.Number, require:true},
  tempoM: {type: Schema.Types.Number, require:true},
  tempoApos: {type: Schema.Types.Number, require:true},
  INSSproject: {type: Schema.Types.Number, require:true},
  otherSourcesFinal: {type: Schema.Types.Number, require:true},
  taxaM: {type: Schema.Types.Number, require:true},
  taxaNumber: {type: Schema.Types.Number, require:true},
  montante: {type: Schema.Types.Number, require:true},
  ValueApos: {type: Schema.Types.Number, require:true},
  idadeMilion: {type: Schema.Types.Number, require:true},
  totalAmountInit: {type: Schema.Types.Number, require:true},
  gainAmountInit: {type: Schema.Types.Number, require:true},
  tenYears: {type: Schema.Types.Number, require:true},
  PortionMin: {type: Schema.Types.Number, require:true},
  PortionNegative: {type: Schema.Types.Number, require:true},
  
  dateTo: {type: String, default: Date.now, require:true },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    require:true
  },
  type: String

  
})

export default mongoose.model<IProjectLife>('ProjectLife', projectLifeSchema, 'projectLife' )




