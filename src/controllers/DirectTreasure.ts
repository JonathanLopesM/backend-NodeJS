import DirectTreasureModel from "../models/DirectTreasureModel";

export const DirectTreasure= async (req, res ) => {
  const { userId } = req as any
  console.log(userId, 'userId directTreasure')
  const { buyValue, amount, dateBuy,
    dateSell, codeName, type
  } = req.body;
  const buyValue3 = buyValue.replaceAll('.', '')
  console.log(buyValue3, 'buyValue3 directTreasure')

  const buyValue2 = Number(buyValue3.replace(',', '.'))
  console.log(buyValue2, 'buyValue2' )

  const data = {
    buyValue2, amount, dateBuy,
    dateSell, codeName, type,
    user: userId
  }

  const response = await DirectTreasureModel.create(data)

  res.status(200).json({ response })
}