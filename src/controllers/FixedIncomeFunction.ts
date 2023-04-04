import FixedIncome from "../models/FixedIncome";

export const FixedIncomeFunction= async (req, res ) => {
  const { userId } = req as any
  const { buyValue, percentAmount, dateBuy,
    dateSell, codeName, type
  } = req.body;
  const buyValue3 = buyValue.replaceAll('.', '')
  console.log(buyValue3, 'buyValue3')

  const buyValue2 = Number(buyValue3.replace(',', '.'))
  console.log(buyValue2, 'buyValue2' )

  const data = {
    buyValue2, percentAmount, dateBuy,
    dateSell, codeName, type,
    user: userId
  }

  const response = await FixedIncome.create(data)

  res.status(200).json({ response })
}