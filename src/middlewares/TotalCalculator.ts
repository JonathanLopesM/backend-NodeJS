import Amounts from "../models/Amounts"

async function TotalCalculator(req, res, next) {
  const { userId } = req
  // console.log(userId)

  //Array to Wallet
  
  const customers = await Amounts.find({user: userId})

  //Calculo para o total de -DEBITOS
    const customersDebit = customers.filter((obj) => { 
      return obj.type === 'debit'
    })
    var valueDebits = customersDebit.map(customer => {
      return customer.amount
    })
    var TotalDebits = 0
    for(var i = 0; i < valueDebits.length; i++){
      TotalDebits += valueDebits[i]
    }
    // console.log(TotalDebits)
    req.TotalDebits = Number(TotalDebits.toFixed(2))
  
  

  //Calculo de Creditos

  const customersCredit = customers.filter((obj) => { 
    return obj.type === 'credit'
  })
  var valueCredits = customersCredit.map(customer => { 
    return customer.amount 
  })
  var TotalCredits = 0
  for(var i = 0; i < valueCredits.length; i++ ){
    TotalCredits += valueCredits[i]
  }
  // console.log(TotalCredits)
  req.TotalCredits = Number(TotalCredits.toFixed(2))

  var TotalFounds = TotalCredits - TotalDebits
  // console.log(TotalFounds)
  req.TotalFounds = Number(TotalFounds.toFixed(2))


  var PercentDebits = TotalDebits / (TotalCredits / 100)

  req.PercentDebits = Number(PercentDebits.toFixed(2))
  
  var PercentCredits = PercentDebits - 100
  PercentCredits = Math.abs(PercentCredits)

  req.PercentCredits = Number(PercentCredits.toFixed(2))
  
  return next()
}


export default TotalCalculator