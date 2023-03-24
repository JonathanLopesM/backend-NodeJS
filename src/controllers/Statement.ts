import Amounts from "../models/Amounts"

export default async function Statement(req, res)  {
  const { userId, TotalFounds, TotalDebits, TotalCredits , greet, PercentDebits,PercentCredits } = req as any  


  const customer = await Amounts.find({user:userId})

  return res.status(200).json({customer,TotalFounds, TotalDebits, TotalCredits, greet,PercentDebits,PercentCredits})
}