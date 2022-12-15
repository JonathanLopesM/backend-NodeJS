import Amounts from "../models/Amounts"

export default async function UpdatedWallet(req,res) {
  const { id } = req.params
  const { description, amount, type } = req.body

  let debit = await Amounts.findByIdAndUpdate(id, {
    description,
    amount,
    type
  })
  return res.json({ debit})
}