import Patrimonys from '../models/Patrimony'


export default async function ViewBalance (req, res) {
  const { userId, TotalFounds, TotalDebits, 
          TotalCredits, TotalActives, TotalPassives,
           TotalPatrimony, TotalActiveSheets,TotalNonActiveSheets,TotalPassiveSheets,
            TotalNonPassiveSheets, ILC, IE 
          } = req as any  

  const balance = await Patrimonys.find({ user: userId })

  return res.json({ balance, TotalFounds, TotalDebits, TotalCredits, TotalActives, TotalPassives, TotalPatrimony,TotalActiveSheets,TotalNonActiveSheets,TotalPassiveSheets, TotalNonPassiveSheets, ILC, IE })
}