import DirectTreasureModel from "../models/DirectTreasureModel";

export const DirectTreasure= async (req, res ) => {
  const { userId } = req as any
  // console.log(userId, 'userId directTreasure')
  const { buyValue, amount, dateBuy,
    dateSell, codeName, type
  } = req.body;
  const buyValue3 = buyValue.replaceAll('.', '')


  const buyValue2 = Number(buyValue3.replace(',', '.'))
console.log(amount, 'amount do post') 
let amountNum= 0 as any
if(amount === Number){
  amountNum = Number(amount.replace(',', '.'))
} else {
  amountNum = amount.replaceAll('.', '')
  amountNum = Number(amountNum.replace(',', '.'))
}


  const data = {
    buyValue2, amountNum, dateBuy,
    dateSell, codeName, type,
    user: userId
  }

  const response = await DirectTreasureModel.create(data)

  res.status(200).json({ response })
}