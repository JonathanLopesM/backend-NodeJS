import Patrimony from "../models/Patrimony";

async function PatrimonyCalculate (req, res, next) {
  const { userId } = req
  const balances = await Patrimony.find({ user: userId })

//TOTAL ACTIVES INIT
  const Actives = balances.filter(obj => {
    return obj.type === 'Ativo'
  })
  var valueActives = Actives.map(active => {
    return active.amount
  })
  var TotalActives = 0
  for(var i = 0; i < valueActives.length; i++){
    TotalActives += valueActives[i]
  }
  req.TotalActives = Number(TotalActives.toFixed(2))

  //TOTAL ACTIVES SHEETS
  const activeSheets = balances.filter(obj=> {
    return obj.category === 'Ativo Circulante'
  })
  var valueActiveSheets = activeSheets.map(active=> {
    return active.amount
  })
  var TotalActiveSheets = 0
  for(var i = 0; i< valueActiveSheets.length; i++){
    TotalActiveSheets += valueActiveSheets[i]
  }
  req.TotalActiveSheets = Number(TotalActiveSheets.toFixed(2))

  //Total Non Actives Sheets
  const nonActiveSheets = balances.filter(obj => {
    return obj.category === 'Ativo Não Circulante'
  })
  var valueNonActiveSheets = nonActiveSheets.map(active=> {
    return active.amount
  })
  var TotalNonActiveSheets = 0
  for(var i = 0; i< valueNonActiveSheets.length; i++){
    TotalNonActiveSheets += valueNonActiveSheets[i]
  }
  req.TotalNonActiveSheets = Number(TotalNonActiveSheets.toFixed(2))


  //TOTAL PASSIVES INIT
  const Passives = balances.filter(obj => {
    return obj.type === 'Passivo'
  })
  var valuePassives = Passives.map(passive => {
    return passive.amount
  })
  var TotalPassives = 0
  for(var i = 0; i < valuePassives.length; i++){
    TotalPassives += valuePassives[i]
  }
  req.TotalPassives = Number(TotalPassives.toFixed(2))

  //TOTAL ACTIVES SHEETS
  const passiveSheets = balances.filter(obj=> {
    return obj.category === 'Passivo Circulante'
  })
  var valuePassiveSheets = passiveSheets.map(active=> {
    return active.amount
  })
  var TotalPassiveSheets = 0
  for(var i = 0; i< valuePassiveSheets.length; i++){
    TotalPassiveSheets += valuePassiveSheets[i]
  }
  req.TotalPassiveSheets = Number(TotalPassiveSheets.toFixed(2))
  
  //Total Non Passive Sheets
  const nonPassiveSheets = balances.filter(obj => {
    return obj.category === 'Passivo Não Circulante'
  })
  var valueNonPassiveSheets = nonPassiveSheets.map(active=> {
    return active.amount
  })
  var TotalNonPassiveSheets = 0
  for(var i = 0; i< valueNonPassiveSheets.length; i++){
    TotalNonPassiveSheets += valueNonPassiveSheets[i]
  }
  req.TotalNonPassiveSheets = Number(TotalNonPassiveSheets.toFixed(2))


  //ILC 
  const ILC = TotalActiveSheets / TotalPassiveSheets
    req.ILC = Number(ILC.toFixed(2))
  // IE 
  const IE = (TotalPassives*100) / TotalActives
    req.IE = Number(IE.toFixed(2))


  //TOTAL PATRIMONY INIT
  var TotalPatrimony = TotalActives - TotalPassives
  req.TotalPatrimony = Number(TotalPatrimony.toFixed(2))
  //TOTAL PATRIMONY FINNALY

  return next()
}

export default PatrimonyCalculate