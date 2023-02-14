require('dotenv').config()

import cors from 'cors'
import express, { application } from 'express'
import mongoose from 'mongoose'
import {storage, limits} from './MulterConfig'
import multer from 'multer'
import axios from 'axios'
import request from 'request'
import { GoogleSpreadsheet } from 'google-spreadsheet'
const credentials = require('../credentials.json')

import checkToken from './middlewares/CheckToken'

import LoginUser from './controllers/LoginUser'
import PrivateRoute from './controllers/PrivateRoute'
import RegisterUser from './controllers/RegisterUser'
import RecoverPassword from './controllers/RecoverPassword'
import ResetPass from './controllers/ResetPass'
import ResetPassword from './controllers/ResetPassword'

import TotalCalculator from './middlewares/TotalCalculator'
import PatrimonyCalculate from './middlewares/PatrimonyCalculate'
import { GreetTime } from './middlewares/GreetTime'

import Statement from './controllers/Statement'
import Deposit from './controllers/Deposit'
import UpdatedWallet from './controllers/UpdatedWallet'
import DeleteWallet from './controllers/DeleteWallet'
import CreateBalance from './controllers/CreateBalance'
import ViewBalance from './controllers/ViewBalance'
import DeleteBalance from './controllers/DeleteBalance'

import TaxModel from './models/TaxModel'
import TaxCalculate from './middlewares/TaxCalculate'
import Actives from './models/Actives'

import ProjectLife from './models/ProjectLife'

const upload = multer({ storage, limits })

const port = process.env.PORT || 3333 ;

const app = express()

app.use(cors())


app.use(express.json())
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: false }))
app.use('/images', express.static('images'));



// Router Public
app.get('/', (req,res) => {
  res.status(200).json({ message: 'Bem vindo a nossa API'})
})

//Upload Pdf
app.post('/uploadfdna', upload.single('file'), (req, res) => {
  // console.log(req)
  // console.log(req.file)
  return res.json(req.file.filename)
})

// Private Route
app.get('/user/:id', checkToken, TotalCalculator, PrivateRoute )

//API ALPHA
app.get('/alpha', async (req, res) => {
  const token = process.env.TOKEN_API
  const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=petr&apikey=${token}`;

const response = await request.get({
    url: url,
    json: true,
    headers: {'User-Agent': 'request'}
  }, (err, res, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else {
      // data is successfully parsed as a JSON object:
      console.log(data);
    }
});

console.log(response)
})
app.post('/calcamount', checkToken, async (req, res)=>{
  const {yearsTime, taxValue, AmountCalc, AmountCalcInit } = req.body as any

  console.log(yearsTime, taxValue, AmountCalc, AmountCalcInit, 'antes de formatar')
  var taxValueNum = taxValue.replaceAll('.', '')
  var taxValueCorrect = Number(taxValueNum.replace(',', '.'))

  var amountNum = AmountCalc.replaceAll('.','')

  var amountNumCorrect = Number(amountNum.replace(',','.'))

  var amountInitNum = AmountCalcInit.replaceAll('.', '')
  var AmountInitCorrect = Number(amountInitNum.replace(',', '.'))
// console.log(taxValueCorrect, amountNumCorrect, AmountInitCorrect, taxValueCorrect, 'depois de format')
  const investmentAmount = amountNumCorrect - AmountInitCorrect 
const interestRate = (taxValueCorrect / 12) / 100;
const months = yearsTime * 12;
const monthlyInterestRate = interestRate;

console.log(taxValueCorrect, amountNumCorrect, AmountInitCorrect, investmentAmount, interestRate, months , 'dados tratados')

const resGuria = ((0.0095 / 1) - 1 ) / ((1+ 0.0095)**480)
// console.log(resGuria, "calculo ")
const response = investmentAmount * ((1+ interestRate)** -1) * (interestRate / (((1 + interestRate)**months) - 1))
// console.log(response, 'resultado')

console.log(response, 'response ')
return res.json({response})

})
//API Google Spreedsheet
app.post('/aposent', checkToken, async (req, res) => {
  // const docId = process.env.ID_PLANILHA

  // const doc = new GoogleSpreadsheet(docId)

  // const response = await doc.useServiceAccountAuth(credentials, async () => {
  //   await doc.loadInfo()
  // })
  // console.log(response)
  const {yearsOldNow,retirement, applyMonth, patrimonyInit, yearsConstruct, lifeExpect,retirementeValue, projectedINSS , otherSources, taxYear,taxMonth} = req.body as any
  // console.log(yearsOldNow,retirement, applyMonth, patrimonyInit, yearsConstruct, lifeExpect,retirementeValue, projectedINSS , otherSources, taxYear,taxMonth, 'req.body')
  const {userId} = req as any
  // console.log(userId, 'user')

  var yearOld = Number(yearsOldNow)
  
  const patrimonyFormated = patrimonyInit.replaceAll('.', '')
  var montante = Number(patrimonyFormated.replace(',', '.')) // Valor Acumulado Atualmente
  var montanteInit = montante
  const applyMonthFormated = applyMonth.replaceAll('.', '')
  var ValueMonth = Number(applyMonthFormated.replace(',', '.')) //55.76 //Valor de aporte por mes

  var taxNumber = Number(taxYear)

  const taxMonthFormated = taxMonth.replaceAll('.', '')
  var taxaM = Number(taxMonthFormated.replace(',', '.')) //0.95 // Taxa por mês
  
  const projectedINSSFormated = projectedINSS.replaceAll('.','')
  var INSSproject = Number(projectedINSSFormated.replace(',', '.'))

  const otherSourcesFormated = otherSources.replaceAll('.','')
  var otherSourcesFinal = Number(otherSourcesFormated.replace(',', '.'))

  const timeWork = yearsConstruct
  var tempoM = timeWork *12 // Meses de Criação de patrimonio
  var adicionado = 0

  var ValueApos = 0
  var ExpectLife = Number(lifeExpect)

  var RetireValueForm = retirementeValue.replaceAll('.', '')
  var RetireValue = Number(RetireValueForm.replace(',', '.'))
  var descontandoValue = Math.abs(RetireValue - INSSproject - otherSourcesFinal) //Valor a ser descontado para objetivo de aposentadoria
  var tempoApose = (ExpectLife - retirement) * 12 // meses de aposentadoria 65-90 anos 

  // console.log(yearsOldNow, retirement, lifeExpect, applyMonth, patrimonyInit, yearsConstruct, retirementeValue, projectedINSS , otherSources, taxYear, taxMonth, 'req.body')
  // console.log(yearOld, retirement, ExpectLife, ValueMonth, montante, RetireValue,tempoM, tempoApose, INSSproject, otherSourcesFinal, taxaM, taxNumber, 'formats' )

  var totalAmountInit = Number(((tempoM * ValueMonth) + montante).toFixed(2))

  var idade = 0
  var idadeMilion = 0
  var tenYears = 0

  function Montante(montante, taxaM, tempoM){
    montante = (montante +(montante * (taxaM / 100)))  //  * (1 + (taxaM / 100)) ** tempoM
    var txa = taxaM / 100

    montante = Number(montante.toFixed(2))
    return montante
  }
  for(var i = 0; i <= tempoM; i++){
      montante = montante + ValueMonth
      if(i !== 0){
        montante = Montante(montante, taxaM, tempoM)
      }
       idade = Number(((i/12)+yearOld).toFixed(2)) 
      //  console.log(idade, 'recem')
     
      if(tenYears === 0){
        if(i === 132) {
          tenYears = montante
        }
      }
      if(idadeMilion === 0 ){
        if(montante >= 1000000){
          idadeMilion = Number(idade)
        }
      }
     console.log( i, idade.toFixed(2) , montante, "Juros compostos com acumulado")
  }
  var amountRetire = montante
  var gainAmountInit = amountRetire - totalAmountInit

  for(var i = 0; i<= tempoApose; i++){
    montante = montante - descontandoValue
    montante = Montante(montante, taxaM, tempoM)
    var idade = (i/12)+65
    
    if(idade == 65.00){
      // console.log(idade)
      ValueApos = montante
    }
   console.log( idade.toFixed(2), montante, "Descontando Aposentadoria")
  }
  const tax = taxaM / 100
  const valuetotal = RetireValue / tax
  // console.log(valuetotal)
  
  // console.log(tax, 'tax')
  const resultCalc = tax / (1 -(1 / ((1 + tax)**tempoM)))
  // console.log(resultCalc, 'Correct tax')
  const correctTop = valuetotal * resultCalc

  const PortionMin = Number((correctTop - RetireValue).toFixed(2))
  // console.log(PortionMin, 'Parcela')

  const PortionNegative = Number((PortionMin - (PortionMin * 0.0804)).toFixed(2))
  // console.log(PortionNegative, 'parcela negativa')

  const PercentGainTenYears = (tenYears * 100)/ (montanteInit === 0 ? 1 : montanteInit)
  // console.log(PercentGainTenYears, 'PercentGainTenYears')

  const PercentGainFees = ( gainAmountInit * 100)/ (montanteInit === 0 ? 1 : montanteInit)
  console.log(PercentGainFees, 'PercentGainFees')

  const PercentGainRetirement = ( ValueApos * 100)/ (montanteInit === 0 ? 1 : montanteInit)
  console.log(PercentGainRetirement, 'PercentGainRetirement')

  const PercentProjectPatrimony = ( montante * 100)/ (montanteInit === 0 ? 1 : montanteInit)
  console.log(PercentProjectPatrimony, 'PercentProjectPatrimony')



  const data = {
    yearOld, retirement, ExpectLife, ValueMonth, 
    montanteInit,  RetireValue,tempoM, tempoApose, 
    INSSproject, otherSourcesFinal, taxaM, taxNumber,
    montante, ValueApos ,idadeMilion, totalAmountInit, 
    gainAmountInit, tenYears, PortionMin, PortionNegative,
    PercentGainTenYears, PercentGainFees,PercentGainRetirement,
    PercentProjectPatrimony,
    user: userId
  }
  const Retirement = await ProjectLife.create(data)
  // console.log('idadeAtual',yearOld, 'idade aposentado', retirement, 'expectativa', ExpectLife, 'valor por mes', ValueMonth, 'Montante inicial', montanteInit, 'retirado na aposentadoria', RetireValue,'tempo de produçao',tempoM, 'tempo de aposentadoria',tempoApose, 'valor inss', INSSproject, 'outras fontes', otherSourcesFinal, 'taxa mensal', taxaM, 'taxa anual', taxNumber, 'montante final calculo', montante, 'montante no ano de aposentado', ValueApos , 'idade 1 milhão', idadeMilion, 'total guardado sem juros',  totalAmountInit,gainAmountInit, 'montante em 10 anos',tenYears, 'parcela Boa', PortionMin, 'Parcela ruim', PortionNegative, 'Salvar no banco' )  

  return res.json({montante, ValueApos , idadeMilion, totalAmountInit,gainAmountInit, tenYears, PortionMin, PortionNegative })
})
app.get('/aposent', checkToken, async (req, res )=> {
  const { userId } = req as any
  // console.log(userId, 'idUser')

  const response = await ProjectLife.find({user: userId})

  return res.json({response})

})
app.put('/aposent/:id', checkToken, async (req, res) => {
  const {id} = req.params as any
  const {yearsOldNow,retirement, applyMonth, patrimonyInit, yearsConstruct, lifeExpect,retirementeValue, projectedINSS , otherSources, taxYear,taxMonth} = req.body as any
  // console.log(yearsOldNow,retirement, applyMonth, patrimonyInit, yearsConstruct, lifeExpect,retirementeValue, projectedINSS , otherSources, taxYear,taxMonth, 'req.body')
  const {userId} = req as any
  // console.log(userId, 'user')

  var yearOld = Number(yearsOldNow)
  

  const patrimonyFormated = patrimonyInit.replaceAll('.', '')
  var montante = Number(patrimonyFormated.replace(',', '.')) // Valor Acumulado Atualmente
  var montanteInit = montante
  const applyMonthFormated = applyMonth.replaceAll('.', '')
  var ValueMonth = Number(applyMonthFormated.replace(',', '.')) //55.76 //Valor de aporte por mes

  var taxNumber = Number(taxYear)

  const taxMonthFormated = taxMonth.replaceAll('.', '')
  var taxaM = Number(taxMonthFormated.replace(',', '.')) //0.95 // Taxa por mês
  
  const projectedINSSFormated = projectedINSS.replaceAll('.','')
  var INSSproject = Number(projectedINSSFormated.replace(',', '.'))

  const otherSourcesFormated = otherSources.replaceAll('.','')
  var otherSourcesFinal = Number(otherSourcesFormated.replace(',', '.'))

  const timeWork = yearsConstruct
  var tempoM = timeWork *12 // Meses de Criação de patrimonio
  var adicionado = 0

  var ValueApos = 0
  var ExpectLife = Number(lifeExpect)

  var RetireValueForm = retirementeValue.replaceAll('.', '')
  var RetireValue = Number(RetireValueForm.replace(',', '.'))
  var descontandoValue = Math.abs(RetireValue - INSSproject - otherSourcesFinal) //Valor a ser descontado para objetivo de aposentadoria
  var tempoApose = (ExpectLife - retirement) * 12 // meses de aposentadoria 65-90 anos 

  var totalAmountInit = Number(((tempoM * ValueMonth) + montante).toFixed(2))

  

  var idade = 0
  var idadeMilion = 0
  var tenYears = 0

  function Montante(montante, taxaM, tempoM){
    montante = (montante +(montante * (taxaM / 100)))  //  * (1 + (taxaM / 100)) ** tempoM
    var txa = taxaM / 100

    montante = Number(montante.toFixed(2))
    return montante
  }
  for(var i = 0; i <= tempoM; i++){
      montante = montante + ValueMonth
      if(i !== 0){
        montante = Montante(montante, taxaM, tempoM)
      }
       idade = Number(((i/12)+yearOld).toFixed(2)) 
      //  console.log(idade, 'recem')
     
      if(tenYears === 0){
        if(i === 132) {
          tenYears = montante
        }
      }
      if(idadeMilion === 0 ){
        if(montante >= 1000000){
          idadeMilion = Number(idade)
        }
      }
    //  console.log( i, idade.toFixed(2) , montante, "Juros compostos com acumulado")
  }
  var amountRetire = montante
  var gainAmountInit = amountRetire - totalAmountInit

  for(var i = 0; i<= tempoApose; i++){
    montante = montante - descontandoValue
    montante = Montante(montante, taxaM, tempoM)
    var idade = (i/12)+65
    
    if(idade == 65.00){
      // console.log(idade)
      ValueApos = montante
    }
  //  console.log( idade.toFixed(2), montante, "Descontando Aposentadoria")
  }
  const tax = taxaM / 100
  const valuetotal = RetireValue / tax
  // console.log(valuetotal)
  
  // console.log(tax, 'tax')
  const resultCalc = tax / (1 -(1 / ((1 + tax)**tempoM)))
  // console.log(resultCalc, 'Correct tax')
  const correctTop = valuetotal * resultCalc

  const PortionMin = Number((correctTop - RetireValue).toFixed(2))
  // console.log(PortionMin, 'Parcela')

  const PortionNegative = Number((PortionMin - (PortionMin * 0.0804)).toFixed(2))
  // console.log(PortionNegative, 'parcela negativa')

  const PercentGainTenYears = (tenYears * 100)/ (montanteInit === 0 ? 1 : montanteInit)
  console.log(PercentGainTenYears, 'PercentGainTenYears')

  const PercentGainFees = ( gainAmountInit * 100)/ (montanteInit === 0 ? 1 : montanteInit)
  console.log(PercentGainFees, 'PercentGainFees')

  const PercentGainRetirement = ( ValueApos * 100)/ (montanteInit === 0 ? 1 : montanteInit)
  console.log(PercentGainRetirement, 'PercentGainRetirement')

  const PercentProjectPatrimony = ( montante * 100)/ (montanteInit === 0 ? 1 : montanteInit)
  console.log(PercentProjectPatrimony, 'PercentProjectPatrimony')

  const data = {
    yearOld, retirement, ExpectLife, ValueMonth, 
    montanteInit,  RetireValue,tempoM, tempoApose, 
    INSSproject, otherSourcesFinal, taxaM, taxNumber,
    montante, ValueApos ,idadeMilion, totalAmountInit, 
    gainAmountInit, tenYears, PortionMin, PortionNegative,
    PercentGainTenYears, PercentGainFees,PercentGainRetirement,
    PercentProjectPatrimony,
    user: userId
  }
  const Retirement = await ProjectLife.findByIdAndUpdate(id, data, {new:true})
  // console.log('idadeAtual',yearOld, 'idade aposentado', retirement, 'expectativa', ExpectLife, 'valor por mes', ValueMonth, 'Montante inicial', montanteInit, 'retirado na aposentadoria', RetireValue,'tempo de produçao',tempoM, 'tempo de aposentadoria',tempoApose, 'valor inss', INSSproject, 'outras fontes', otherSourcesFinal, 'taxa mensal', taxaM, 'taxa anual', taxNumber, 'montante final calculo', montante, 'montante no ano de aposentado', ValueApos , 'idade 1 milhão', idadeMilion, 'total guardado sem juros',  totalAmountInit,gainAmountInit, 'montante em 10 anos',tenYears, 'parcela Boa', PortionMin, 'Parcela ruim', PortionNegative, 'Salvar no banco' )  

  return res.json({montante, ValueApos , idadeMilion, totalAmountInit,gainAmountInit, tenYears, PortionMin, PortionNegative })
})

//CRUD ACTIVES B3
app.post('/active', checkToken, async (req, res) => {
  const { buyValue, quantBuy, dateBuy,
    name, codeName,
    dateform, type 
  } = req.body as any
  const {userId} = req as any
  // console.log(userId, 'user')

  const ticker = await axios.get(`https://brapi.dev/api/quote/${codeName}`)


  const valueNow = ticker.data.results[0].regularMarketPrice

  const format =  buyValue.replaceAll('.', '')
  const formatedBuyValue = format.replace(',', '.')
  const valueTotalBuy = Number(quantBuy) * Number(formatedBuyValue)
  const valueTotalBuyNow = Number(quantBuy) * valueNow

  const valueNumber = Number(formatedBuyValue)


  const ActiveBody = {
    user:userId,
    buyValue:valueNumber , 
    dateBuy, 
    quantBuy,
    name, 
    codeName,
    dateform, type,
    valueNow
  }
  // console.log(ActiveBody, 'body')
  const Active = await Actives.create(ActiveBody)

  return res.json({ Active })
})

app.get('/active', checkToken,async (req, res) => {
  const { userId } = req as any

  const response = await Actives.find({user: userId})

  const TickersAll = await axios.get(`https://brapi.dev/api/quote/list`)

  var CodeName = [] as any
  const tickers = response.map((ticker) => {
    return ticker.codeName.toLocaleUpperCase()
  })
  // console.log(tickers, 'tickers name')
  app.delete('/deleteactive/:id', checkToken, async (req, res )=> {
    const {id} = req.params

    await Actives.findByIdAndDelete(id)

    return res.send()
  })


  const stockUpList = TickersAll.data.stocks.filter(stock => {
    for(var i=0; i <= tickers.length ; i++){
      if (stock.stock === tickers[i]) {
        return  stock
      }
    }
  })
  // console.log(stockUpList, 'stockList')

  const UpdatedStock = response.map(ticker => {

    var UpDown = false
    var amountTicker = 0
    var amountInit=0
    var currentVariation = 0
    var totalVariation = 0
    var percentTotalVariation = 0
    var valueNow= 0

    const valueFinally = stockUpList.filter(stock => {
      if(stock.stock === ticker.codeName.toLocaleUpperCase()){
        return stock
      }
    })
    if(valueFinally[0].change > 0){
      UpDown= true
    }else {
      UpDown = false
    }
    amountInit = ticker.buyValue * ticker.quantBuy
    amountTicker = Number((valueFinally[0].close * ticker.quantBuy).toFixed(2))
    // console.log(valueFinally[0])

    if(valueFinally[0].change > 0 ){
      currentVariation = Number(((amountTicker * (Math.abs(valueFinally[0].change))) / 100+(Math.abs(valueFinally[0].change))).toFixed(2))
    } else {
      currentVariation = -Number(((amountTicker * (Math.abs(valueFinally[0].change))) / 100+(Math.abs(valueFinally[0].change))).toFixed(2))
    }


    if(amountInit > amountTicker){
      totalVariation = Number((amountTicker - amountInit).toFixed(2))
      percentTotalVariation= -Number(((totalVariation * 100)/ amountInit).toFixed(2))  
    }else if(amountInit < amountTicker) {
      totalVariation = Number((amountTicker - amountInit).toFixed(2))
      percentTotalVariation= Number(((totalVariation * 100)/ amountInit).toFixed(2))
    }
    
  valueNow = Number((valueFinally[0].close).toFixed(2))

  const Ticker = {
    id: ticker.id,
    logo: valueFinally[0].logo,
    codeName: ticker.codeName.toLocaleUpperCase(),
    buyValue: ticker.buyValue,
    valueNow, // Valor Atual
    buyQuant: ticker.quantBuy,
    UpDown,
    percent: valueFinally[0].change,
    currentVariation,
    amountInit,
    amountTicker,
    totalVariation,
    percentTotalVariation,
    sector: valueFinally[0].sector,
    
  }
  return Ticker
    
  
  
    
  })
// console.log(UpdatedStock)
 
  return res.json({UpdatedStock})

})

app.get('/sticker', async ( req, res) => {

const TickersAll = await axios.get(`https://brapi.dev/api/quote/list`)

const vale3 = TickersAll.data.stocks.filter(stock => {
  if(stock.stock === 'VALE3'){
    return stock
  }
})
const petr4 = TickersAll.data.stocks.filter(stock => {
  if(stock.stock === 'PETR4'){
    return stock
  }
})
const itub3 = TickersAll.data.stocks.filter(stock => {
  if(stock.stock === 'ITUB3'){
    return stock
  }
})
const bbdc4 = TickersAll.data.stocks.filter(stock => {
  if(stock.stock === 'BBDC4'){
    return stock
  }
})
const abev3 = TickersAll.data.stocks.filter(stock => {
  if(stock.stock === 'ABEV3'){
    return stock
  }
})

const stocksTops = [
  vale3, petr4, itub3, bbdc4, abev3
]

return res.json({stocksTops})

})

//CRUD TAX PLANNING INIT
app.post('/taxplanning', checkToken, TaxCalculate, async (req, res) => {
  const { userId, annualIncomeCorrect,healthCorrect, 
    dependentsCorrect, spendingOnEducation, Alimony,
    ContributionPGBL, INSS,withholdingTax,
     FirstAliquot, SecondAliquot, 
    ThirdAliquot, FourAliquot, FiveAliquot,
    taxTotal, BalanceRefounded, NewTaxBase, taxFirst, taxSecond, TaxThirdRate, TaxFourRate, TaxFiveRate,
     EducationCalc,PGBLCalc,dependentsCalc, TotalDedution,CorrectAliquot,AliquoteEffect
    }= req as any
    // console.log(BalanceRefounded, 'post')
  // console.log(FirstAliquot, SecondAliquot, ThirdAliquot, FourAliquot, FiveAliquot,taxTotal, BalanceRefounded ,taxFirst, taxSecond ,NewTaxBase,EducationCalc,PGBLCalc,dependentsCalc, 'na rota')

  const taxPlanning = {
    user:userId,
    annualIncomeCorrect,
    healthCorrect, 
    dependentsCorrect, 
    spendingOnEducation, 
    Alimony,
    ContributionPGBL, 
    INSS, 
    withholdingTax,
    FirstAliquot, SecondAliquot,ThirdAliquot, FourAliquot, FiveAliquot,
    taxTotal,BalanceRefounded, NewTaxBase, taxFirst, taxSecond,TaxThirdRate, TaxFourRate, TaxFiveRate,
    EducationCalc,PGBLCalc,dependentsCalc, TotalDedution,CorrectAliquot,AliquoteEffect
  }
  // console.log(taxPlanning, 'verificar ')

  const TaxPlanCreateResponse = await TaxModel.create(taxPlanning)
  
  return res.json({ TaxPlanCreateResponse }) 
})

app.get('/gettaxplans', checkToken, async (req, res)=> {
  const {userId} = req as any

  const response = await TaxModel.find({user: userId})

  res.json({ response })

})

app.put('/taxplanning/:id', checkToken, TaxCalculate, async (req, res) => {
  const {id} = req.params
  const {userId, annualIncomeCorrect,healthCorrect,dependentsCorrect, Alimony, spendingOnEducation, ContributionPGBL, INSS,withholdingTax,
     FirstAliquot, SecondAliquot, ThirdAliquot, FourAliquot, FiveAliquot,
    taxTotal,BalanceRefounded,PercentBalanceRefounded, NewTaxBase, taxFirst, taxSecond,TaxThirdRate, TaxFourRate, TaxFiveRate,EducationCalc,PGBLCalc,dependentsCalc, TotalDedution,CorrectAliquot,AliquoteEffect
    }= req as any
    // console.log(BalanceRefounded, 'up')
  //  console.log(FirstAliquot, SecondAliquot, ThirdAliquot, FourAliquot, FiveAliquot,taxTotal, taxFirst, taxSecond ,NewTaxBase,EducationCalc,PGBLCalc,dependentsCalc, TotalDedution, 'na rota')

  const taxPlanning = {
    user:userId,
    annualIncomeCorrect,
    healthCorrect, 
    dependentsCorrect, 
    spendingOnEducation, 
    Alimony,
    ContributionPGBL, 
    INSS, 
    withholdingTax,
    FirstAliquot, SecondAliquot,ThirdAliquot, FourAliquot, FiveAliquot,
    taxTotal,BalanceRefounded,PercentBalanceRefounded, NewTaxBase, taxFirst, taxSecond,TaxThirdRate, TaxFourRate, TaxFiveRate,
    EducationCalc, PGBLCalc, dependentsCalc,TotalDedution, CorrectAliquot,AliquoteEffect 
  }
  
  const response = await TaxModel.findByIdAndUpdate(id, taxPlanning, {new:true})
  // console.log(response, 'up')
  res.json({ response })
})


//FINANCIAL MANAGEMENT CRUD INIT
app.get('/statement', checkToken, TotalCalculator, GreetTime, Statement)
//Deposit 
app.post('/deposit', checkToken, TotalCalculator, Deposit)
//List Customer
app.put('/updated/:id', checkToken, UpdatedWallet)
// Delete 
app.delete('/delete/:id', checkToken, TotalCalculator, DeleteWallet)


//BalanceShet CRUD INIT
app.post('/createBalance', checkToken, CreateBalance)

app.get('/viewbalance', checkToken, PatrimonyCalculate, ViewBalance)

app.delete('/deletebalance/:id', checkToken, TotalCalculator, DeleteBalance)

//CRUD USER
//Route Register User 
app.post('/auth/register', RegisterUser)
//Login User
app.post('/auth/user', TotalCalculator, GreetTime, LoginUser)

//RESET PASSWORD CRUD
// Recover Password
app.post('/recover', RecoverPassword)
//Reset Get
app.get('/reset-password/:id/:token', ResetPassword)
//Reset Create
app.post('/reset-password/:id/:token', ResetPass)



// db credentials
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS
console.log('1' ,dbUser, dbPass)

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.s1s1pe2.mongodb.net/?retryWrites=true&w=majority`)
.then(()=> {
app.listen(port)

  console.log("Success Conected database")
}).catch((err) => {
  console.log('2', dbUser, dbPass)
  console.log('Erro especificado a baixo')
  console.log(err)
})




