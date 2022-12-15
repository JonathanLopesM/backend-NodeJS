import Amounts from "../models/Amounts";


export default async function Deposit (req, res){
    const { description, value, type, date, category } = req.body;
    const { userId, TotalFounds, TotalDebits, TotalCredits} = req as any

    //validations
    if(!description){
      return res.status(422).json({ message: 'A descrição é obrigatória'})
    }
    if(!value){
      return res.status(422).json({ message: 'O Valor é obrigatório'})
    }
    if(!date){
      return res.status(422).json({ message: 'A Data é obrigatório'})
    }
    if(!category){
      return res.status(422).json({ message: 'A Categoria é obrigatória'})
    }

    var ValueTo = value.replace(".", "")
    var ValueTo2 = ValueTo.replace(",", ".")
    var amount = Number.parseFloat(ValueTo2).toFixed(2)

    const dateform = new Date(date)
    const dateTo = (((dateform.getDate() +1 )) + "/" + ((dateform.getMonth() + 1)) + "/" + dateform.getFullYear()).toString(); 


    const statement = {
      user:userId,
      description,
      amount,
      type,
      dateTo,
      category
    } 


    const CustomerState = await Amounts.create(statement)

    return res.json({ CustomerState, TotalFounds, TotalDebits, TotalCredits })
}