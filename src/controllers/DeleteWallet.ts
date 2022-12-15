import Amounts from "../models/Amounts"

export default async function DeleteWallet (req, res){
  const { id } = req.params
  const { userId, TotalFounds, TotalDebits, TotalCredits } = req as any

   await Amounts.findByIdAndDelete(id)
  return res.json({ TotalFounds, TotalDebits, TotalCredits})
}