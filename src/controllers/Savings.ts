import SavingsModel from "../models/SavingsModel";

export const Savings= async (req, res ) => {
  const { userId } = req as any
  console.log(userId, 'userId directTreasure')
  const { buyValue, dateBuy,
     codeName, type
  } = req.body;
  const buyValue3 = buyValue.replaceAll('.', '')
  console.log(buyValue3, 'buyValue3 directTreasure')

  const buyValue2 = Number(buyValue3.replace(',', '.'))
  console.log(buyValue2, 'buyValue2' )

  const data = {
    buyValue2, dateBuy,
    codeName, type,
    user: userId
  }
  
  const response = await SavingsModel.create(data)
  res.status(200).json({ response })
}