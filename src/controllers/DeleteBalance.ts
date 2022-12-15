import Patrimonys from "../models/Patrimony"

export default async function DeleteBalance (req, res) {
  const { id } = req.params
  const { userId, TotalFounds, TotalDebits, TotalCredits } = req as any

   await Patrimonys.findByIdAndDelete(id)
  return res.json({ TotalFounds, TotalDebits, TotalCredits})
}