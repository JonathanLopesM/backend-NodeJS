import mongoose, { Schema, SchemaType } from "mongoose";

interface IChart{
  idade: number;
  montante: number;
}

interface IChartTime {
  user: object;
  type: string;
  chart: IChart;
}

interface ICharts extends Array<IChartTime>{}

const chartsTimeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    require:true
  },
  type: String,
  chart: [{
    idade: {type: Schema.Types.Number, require:true},
    montante: {type: Schema.Types.Number, require:true},
  }]

  
})

export default mongoose.model<ICharts>('ChartTime', chartsTimeSchema, 'chartTime' )




