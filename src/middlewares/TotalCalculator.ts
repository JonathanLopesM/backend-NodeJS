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
    req.TotalDebits = TotalDebits
  
  

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
  req.TotalCredits = TotalCredits

  var TotalFounds = TotalCredits - TotalDebits
  // console.log(TotalFounds)
  req.TotalFounds = TotalFounds

  return next()
}


export default TotalCalculator