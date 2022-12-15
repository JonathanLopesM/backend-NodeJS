import Patrimonys from "../models/Patrimony";


export default async function CreateBalance (req, res) {
  const { description, value, type, date, category } = req.body;
  const { userId, TotalFounds, TotalDebits, TotalCredits} = req as any

  //validations
  if(!description){
    return res.status(422).json({ message: 'A descrição é obrigatória'})
  }
  if(!value){
    return res.status(422).json({ message: 'O Valor é obrigatório'})
  }
  if(!category){
    return res.status(422).json({ message: 'A Categoria é obrigatória'})
  }

  var ValueTo = value.replace(".", "")
  var ValueTo2 = ValueTo.replace(",", ".")
   var amount = Number.parseFloat(ValueTo2).toFixed(2)

   
  const dateTo = date

  const balancesheet = {
    user:userId,
    description,
    amount,
    type,
    dateTo,
    category
  } 


  const CustomerState = await Patrimonys.create(balancesheet)

  return res.json({ CustomerState, TotalFounds, TotalDebits, TotalCredits })
}