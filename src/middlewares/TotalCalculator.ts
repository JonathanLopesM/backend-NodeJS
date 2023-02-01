import Amounts from "../models/Amounts"

async function TotalCalculator(req, res, next) {
  const { userId } = req
  // console.log(userId)

  //Array to Wallet
  
  const customers = await Amounts.find({user: userId})
   // Get Month atual and Year
   const date = new Date()
   const monthNow = date.getMonth()+1
   const yearNow = date.getFullYear()


  //CALCULO DE DEBITOS MONTH AND YEAR
  const customersDebit = customers.filter((obj:any) => { 
    const dateFilter = obj.dateTo.split('/') 
      if(monthNow == dateFilter[1] && yearNow == dateFilter[2]){
        return obj.type === 'debit'
      }
    })
    var valueDebits = customersDebit.map(customer => {
      return customer.amount
    })
    var TotalDebits = 0
    for(var i = 0; i < valueDebits.length; i++){
      TotalDebits += valueDebits[i]
    }
    req.TotalDebits = Number(TotalDebits.toFixed(2))

    //Calculo para o total de -DEBITOS
    const customersDebitAll = customers.filter((obj) => { 
      return obj.type === 'debit'
    })
    var valueDebitsAll = customersDebitAll.map(customer => {
      return customer.amount
    })
    var TotalDebitsAll = 0
    for(var i = 0; i < valueDebitsAll.length; i++){
      TotalDebitsAll += valueDebitsAll[i]
    }
    req.TotalDebitsAll = Number(TotalDebitsAll.toFixed(2))


    //Filtro de Mes
    var monthsTypes = customers.map((obj:any) => {
      const month = obj.dateTo.split('/')
      
      return month[1]
    })
    var months = monthsTypes.filter((index, i) => {
      return monthsTypes.indexOf(index) === i
    })
    var TotalToMonth = 0
    for(i=0 ; i < months.length ; i++){
      
      const credits = customers.filter((obj:any) => {
        const dateFilter = obj.dateTo.split('/')
        if(months[i] == dateFilter[1]){
          return obj.type === 'credit'
        }
        
      })
        //Criar a Soma Total de cada
        const CreditValue = credits.map(credit => (
          credit.amount
        ))

        for(i=0; i < credits.length; i++){
          TotalToMonth += CreditValue[i]
        }
    }
  
   
    // Filter to Month and Year Today
    const customersCredit = customers.filter((obj:any) => { 
    const dateFilter = obj.dateTo.split('/') 
      if(monthNow == dateFilter[1] && yearNow == dateFilter[2]){
        return obj.type === 'credit'
      }
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

   //Calculo de Creditos total
   const customersCreditAll = customers.filter((obj) => { 
    return obj.type === 'credit'
  })
  var valueCreditsMonths = customersCreditAll.map(customer => {
    return customer.amount
  })
  var TotalCreditsMonth = 0
  for(var i = 0; i < valueCreditsMonths.length; i++ ){
    TotalCreditsMonth += valueCreditsMonths[i]
  }

  //total founds
  var TotalFounds = TotalCreditsMonth - TotalDebitsAll
  // console.log(TotalFounds)
  req.TotalFounds = Number(TotalFounds.toFixed(2))

  var PercentDebits = 0
    if(TotalDebits < TotalCredits ) {
      PercentDebits = TotalDebits / (TotalCredits / 100)
    }
    else if(TotalCredits < TotalDebits){
      PercentDebits = TotalCredits / (TotalDebits / 100) 
    }

  req.PercentDebits = Number(PercentDebits.toFixed(2))
  
  var PercentCredits = PercentDebits - 100
  PercentCredits = Math.abs(PercentCredits)

  req.PercentCredits = Number(PercentCredits.toFixed(2))
  
  return next()
}


export default TotalCalculator