require('dotenv').config()

import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import {storage, limits} from './MulterConfig'
import multer from 'multer'
import axios from 'axios'
// import { GoogleSpreadsheet } from 'google-spreadsheet'
import dadosFixedJson from '../dadosFixed.json'


import TaxModel from './models/TaxModel'
import Actives from './models/Actives'
import FixedIncome from './models/FixedIncome'
import ProjectLife from './models/ProjectLife'
import ChartsTime from './models/ChartsTime'
import DirectTreasureModel from './models/DirectTreasureModel'

import checkToken from './middlewares/CheckToken'
import TotalCalculator from './middlewares/TotalCalculator'
import PatrimonyCalculate from './middlewares/PatrimonyCalculate'
import { GreetTime } from './middlewares/GreetTime'
import TaxCalculate from './middlewares/TaxCalculate'

import LoginUser from './controllers/LoginUser'
import PrivateRoute from './controllers/PrivateRoute'
import RegisterUser from './controllers/RegisterUser'
import RecoverPassword from './controllers/RecoverPassword'
import ResetPass from './controllers/ResetPass'
import ResetPassword from './controllers/ResetPassword'
import Statement from './controllers/Statement'
import Deposit from './controllers/Deposit'
import UpdatedWallet from './controllers/UpdatedWallet'
import DeleteWallet from './controllers/DeleteWallet'
import CreateBalance from './controllers/CreateBalance'
import ViewBalance from './controllers/ViewBalance'
import DeleteBalance from './controllers/DeleteBalance'
import { CalcAmount } from './controllers/CalcAmount'
import { CreateAposent } from './controllers/CreateAposent'
import { FixedIncomeFunction } from './controllers/FixedIncomeFunction'
import { DirectTreasure } from './controllers/DirectTreasure'
import { Savings } from './controllers/Savings'
import SavingsModel from './models/SavingsModel'
import { google } from 'googleapis'

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

app.get("/metadata", async (req, res) => {

  const { googleSheets, auth, spreadsheetId } = await getAuthSheets()

  const metadata = await googleSheets.spreadsheets.get({
      auth,
      spreadsheetId
  })

  res.send(metadata.data)
})
app.get('/getbrasiltax', async (req, res) => {
  const { googleSheets, auth, spreadsheetId } = await getAuthSheets()

  const JurosBrasil = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Bancos!AW3:AX",
    valueRenderOption: "UNFORMATTED_VALUE"

  })
  const data = JurosBrasil.data

  res.status(200).json({ data })
})

app.get('/getRows', async (req, res) => {
  const { googleSheets, auth, spreadsheetId } = await getAuthSheets()

  const getPrinciple = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Bancos!AZ3:BB",
    valueRenderOption: "UNFORMATTED_VALUE"

  })
  const getETFs = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Bancos!AR2:AT",
    valueRenderOption: "UNFORMATTED_VALUE"

  })
  const getREITs = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Bancos!AJ2:AL",
    valueRenderOption: "UNFORMATTED_VALUE"

  })
  const getSTOCKs = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Bancos!AN2:AP",
    valueRenderOption: "UNFORMATTED_VALUE"

  })
  const getMOEDAs = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Bancos!S2:U",
    valueRenderOption: "UNFORMATTED_VALUE"

  })

  const getIndices = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Bancos!Y2:AA",
    valueRenderOption: "UNFORMATTED_VALUE"

  })
  const getFutures = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Bancos!AE2:AG",
    valueRenderOption: "UNFORMATTED_VALUE"

  })

  const data = {
    Principle: getPrinciple.data.values,
    ETFs: getETFs.data.values,
    REITs: getREITs.data.values, 
    Stocks: getSTOCKs.data.values, 
    Moedas: getMOEDAs.data.values, 
    Indices: getIndices.data.values,
    Futures: getFutures.data.values

  }


  res.status(200).json({ data })
})

//API ALPHA
app.get('/alpha', async (req, res) => {
  const token = process.env.TOKEN_API
  const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=petr&apikey=${token}`;

  const response = await axios.get(url, {
    headers: {'User-Agent': 'request'}
  })

    if (!response.data) {
      console.log('Error:', response.data);
    } else {
      // data is successfully parsed as a JSON object:
      console.log(response.data);
    }

  console.log(response)
    res.send(200).json({response})
  })
app.post('/calcamount', checkToken, CalcAmount)

//Calc Aposent Tax and future expectation
app.post('/aposent', checkToken, CreateAposent )
app.get('/aposent', checkToken, async (req, res )=> {
  const started = new Date() as unknown as number
  const { userId } = req as any
  // console.log(userId, 'idUser')

  const response = await ProjectLife.find({user: userId})
  const ResChart = await ChartsTime.find({user: userId})

  // const ResChart = chartRes
  const end = new Date() as unknown as number
  console.log(`Took ${end - started}ms aposent`)
  return res.json({response, ResChart })

})
app.put('/aposent/:id', checkToken, async (req, res) => {
  const started = new Date() as unknown as number
  const {id} = req.params as any
  const {yearsOldNow,retirement, applyMonth, patrimonyInit, yearsConstruct, lifeExpect,retirementeValue, projectedINSS , otherSources, taxYear,taxMonth} = req.body as any
  // console.log(yearsOldNow,retirement, applyMonth, patrimonyInit, yearsConstruct, lifeExpect,retirementeValue, projectedINSS , otherSources, taxYear,taxMonth, 'req.body')
  const {userId} = req as any
  //  console.log(userId, 'user')
  //  console.log(id, 'id')

  var yearOld = Number(yearsOldNow)
  
  
  const patrimonyFormated = patrimonyInit.replaceAll('.', '')
  var montante = Number(patrimonyFormated.replace(',', '.')) // Valor Acumulado Atualmente
  var montanteInit = montante
  const applyMonthFormated = applyMonth.replaceAll('.', '')
  var ValueMonth = Number(applyMonthFormated.replace(',', '.')) //55.76 //Valor de aporte por mes

  var taxNumber = Number(taxYear)

  //const taxMonthFormated = taxMonth.replaceAll('.', '')
  var taxaM = taxMonth //Number(taxMonthFormated.replace(',', '.')) //0.95 // Taxa por mês
  
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

  var idReturnUp = 0
  var changeOfContribution = 0
  var financialApplications = 0
  var financialExists = 0

  var idade = 0
  var idadeMilion = 0
  var tenYears = 0

  var spreadsheet = []
  var chartsTime = []
  var chartsRetiment = []

  function Montante(montante, taxaM, tempoM){
    montante = (montante +(montante * (taxaM / 100)))  //  * (1 + (taxaM / 100)) ** tempoM
    var txa = taxaM / 100

    montante = Number(montante.toFixed(2))
    return montante
  }
  for(var i = 0; i <= tempoM; i++){
      if(i === idReturnUp){
        if(changeOfContribution > 0){
              ValueMonth = changeOfContribution
        }
        if(financialApplications > 0) {
          montante = montante + financialApplications
        }
        if(financialExists > 0){
          montante = montante - financialExists
        }

      }
      
        montante = Montante(montante, taxaM, tempoM)
        montante = montante + ValueMonth

      
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

      if(Number.isInteger(idade) && idade === 20 || idade === 26 || idade === 33 || idade === 40 ||idade === 47 ||idade === 54 || idade === 61 ||idade === 68 ||idade === 75 || idade === 82 ||idade === 90){
        chartsTime.push({
          idade,
          montante
        })
      }
    // console.log( i, idade.toFixed(2) , montante, "Juros compostos com acumulado")
    spreadsheet.push({
      id: i,
      ValueMonth,
      montante,
      idade

    })
  }
  //console.log(spreadsheet, 'preenchido')
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
    if(Number.isInteger(idade) && idade === 20 || idade === 26 || idade === 33 || idade === 40 ||idade === 47 ||idade === 54 || idade === 61 ||idade === 68 ||idade === 75 || idade === 82 ||idade === 90){
      // console.log(idade, 'idade no if -')
      // console.log(montante, 'montante no if -')
      chartsTime.push({
        idade,
        montante
      })

    }
  //  console.log( idade.toFixed(2), montante, "Descontando Aposentadoria")
    spreadsheet.push({
      id: i,
      ValueMonth,
      montante,
      idade

    })
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
  // console.log(PercentGainFees, 'PercentGainFees')

  const PercentGainRetirement = ( ValueApos * 100)/ (montanteInit === 0 ? 1 : montanteInit)
  // console.log(PercentGainRetirement, 'PercentGainRetirement')

  const PercentProjectPatrimony = ( montante * 100)/ (montanteInit === 0 ? 1 : montanteInit)
  // console.log(PercentProjectPatrimony, 'PercentProjectPatrimony')

  //console.log(spreadsheet, 'Com dedução da aposentadoria')
  // const dataSpread = {
  //   id: userId,
  //   spread: spreadsheet
  // }
  // const spreadRes = await SpreadSheet.findByIdAndUpdate(id, dataSpread, {new:true})
  // console.log(chartsTime, 'chartTime')
  const dataChart = {
    user : userId,
    chart: chartsTime
  }
  const dataRetirement = {
    user: userId,
    chartReti: chartsRetiment
  }
  const test = await ChartsTime.find({id: userId}) as any
  // console.log(test, 'teste 1 ')
  if(test.length > 0){
    ///Corrigir o Updated
    // console.log(test[0]._id, test[0].id, dataChart, 'dataChart')
     await ChartsTime.findByIdAndUpdate(test[0].id, dataChart, {new:true})
    
    // console.log(dataRetirement, 'dataRetirement')
    // await ChartsTimeRetire.findByIdAndUpdate(id, dataRetirement, {new: true})
    // console.log("atualizou")
  } else {
    // console.log("cadastrou")
    await ChartsTime.create(dataChart)
    // await ChartsTimeRetire.create(dataRetirement)
  }
  // console.log(chartsTime, 'chartsTime')
  
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
  const end = new Date() as unknown as number
  console.log(`Took ${end - started}ms aposent updated`)
  return res.json({montante, ValueApos , idadeMilion, totalAmountInit,gainAmountInit, tenYears, PortionMin, PortionNegative, chartsTime })
})

app.post('/savings', checkToken, Savings)

app.get('/savings', checkToken, async (req, res)=>{
  const { userId } = req as any
  // console.log(userId, 'id no savings get')

  const response = await SavingsModel.find({user: userId})

  return res.status(200).json({ response })
})

app.delete('/savings/:id', checkToken, async (req, res )=> {
  const {id} = req.params
  // console.log(id, 'id delete')
  await DirectTreasureModel.findByIdAndDelete(id)

  return res.send()
})


app.post('/direct-treasure', checkToken, DirectTreasure)

app.get('/direct-treasure', checkToken, async (req, res)=>{
  const { userId } = req as any
  // console.log(userId, 'id no direct-Treasure get')

  const response = await DirectTreasureModel.find({user: userId})

  return res.status(200).json({ response })
})
app.delete('/direct-treasure/:id', checkToken, async (req, res )=> {
  const {id} = req.params
  // console.log(id, 'id delete')
  await DirectTreasureModel.findByIdAndDelete(id)

  return res.send()
})


app.post('/fixed-income', checkToken, FixedIncomeFunction)

app.get('/fixed-income', checkToken, async (req, res)=>{
  const { userId } = req as any
  // console.log(userId, 'id no fixed-Income get')

  const response = await FixedIncome.find({user: userId})

  return res.status(200).json({ response })
})

app.delete('/fixed-income/:id', checkToken, async (req, res )=> {
  const {id} = req.params
  // console.log(id, 'id delete')
  await FixedIncome.findByIdAndDelete(id)

  return res.send()
})

// app.get('/testando/:bondName', async (req, res) => {
// //Teste doido
//   // let srcURL = "https://www.tesourodireto.com.br/json/br/com/b3/tesourodireto/service/api/treasurybondsinfo.json";
//   let jsondata =dadosFixedJson.toString() //await axios.get(srcURL) as string;
//   console.log(jsondata, 'jsonData')
//   let parsedData = JSON.parse(jsondata).response;
//   console.log(parsedData, 'parsedData')

//       console.log(parsedData, 'parsedData')
    
//       for(let bond of parsedData.TrsrBdTradgList) {
//           let currBondName = bond.TrsrBd.nm;
//           if (currBondName.toLowerCase() === bondName.toLowerCase())
//               if(argumento == "r")
//                   return bond.TrsrBd.untrRedVal;
//               else
//                   return bond.TrsrBd.untrInvstmtVal;
//       }
//       throw new Error("Título não encontrado.");
    
//   // console.log(response, 'json ')

//   return res.json({})
// /*
// * @return Retorna a cotação atual de um título específico do Tesouro Direto. 
// * Fonte: https://www.tesourodireto.com.br/titulos/precos-e-taxas.htm
// **/
// // async function TESOURODIRETO(bondName, argumento="r") {
// //   let srcURL = "https://www.tesourodireto.com.br/json/br/com/b3/tesourodireto/service/api/treasurybondsinfo.json";
// //   let jsondata = await axios.get(srcURL) as string;
// //   console.log(jsondata, 'jsonData')
// //   let parsedData = JSON.parse(jsondata).response;
// //   console.log(parsedData, 'parsedData')

// //   for(let bond of parsedData.TrsrBdTradgList) {
// //       let currBondName = bond.TrsrBd.nm;
// //       if (currBondName.toLowerCase() === bondName.toLowerCase())
// //           if(argumento == "r")
// //               return bond.TrsrBd.untrRedVal;
// //           else
// //               return bond.TrsrBd.untrInvstmtVal;
// //   }
// //   throw new Error("Título não encontrado.");
// // }
// // TESOURODIRETO()
// })

//CRUD ACTIVES B3

app.post('/active', checkToken, async (req, res) => {
  const { buyValue, quantBuy, dateBuy,
    name, codeName,
    dateform, type 
  } = req.body as any
  const {userId} = req as any
  // console.log(userId, 'userId')
  // console.log(codeName, 'codename')
  const ticker = await axios.get(`https://brapi.dev/api/quote/${codeName}`)
  // console.log(ticker, 'ticker')
  const valueNow = ticker.data.results[0].regularMarketPrice
  // console.log(valueNow, 'valueNow')

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
  //console.log(ActiveBody, 'body buy new')
  const Active = await Actives.create(ActiveBody)

  return res.json({ Active })
})


app.get('/active', checkToken, async (req, res) => {
  const { userId } = req as any
  // console.log(userId, 'userId')
  const response = await Actives.find({user: userId})

  // console.log(response, 'response do getActive')
  const TickersAll = await axios.get(`https://brapi.dev/api/quote/list`)
  
  const tickers = response.map((ticker) => {
    return ticker.codeName.toLocaleUpperCase()
  })
  // console.log(tickers[0], tickers.length-1, 'tickers name')
  // console.log(TickersAll.data.stocks, 'tickersAll')
  var stockUpList = TickersAll.data.stocks.filter(stock => {
    // console.log(stock, 'stock dentro')
    for(var array = 0; array < tickers.length ; array++){
  //  console.log(tickers[array], 'teste')
  //  console.log(stock.stock, 'stock.stock')
      if (tickers[array] == stock.stock ) {
        // console.log(stock.stock, tickers[array], 'stock dentro')
        return stock
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
    var logo = ''
    var percent = ''
    var sector = ''

    const valueFinally = stockUpList.filter(stock => {
      // console.log(stock.stock, ticker.codeName.toLocaleUpperCase() , 'teste dentro do filter')
      if(stock.stock === ticker.codeName.toLocaleUpperCase()){
        return stock
      }
    })
    // console.log(valueFinally, 'valueFinalyy')
    if(valueFinally.length > 0){
      if(valueFinally[0].change && valueFinally[0].change > 0){
        UpDown= true
      }else {
        UpDown = false
      }
      amountInit = ticker.buyValue * ticker.quantBuy
      amountTicker = Number((valueFinally[0].close * ticker.quantBuy).toFixed(2))
      // console.log(valueFinally[0], 'value finally [0]')
  
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

      logo =valueFinally[0].logo
      percent =valueFinally[0].change
      sector =valueFinally[0].sector
    }


    

  const Ticker = {
    id: ticker.id,
    logo,
    codeName: ticker.codeName.toLocaleUpperCase(),
    buyValue: ticker.buyValue,
    valueNow, // Valor Atual
    buyQuant: ticker.quantBuy,
    UpDown,
    percent,
    currentVariation,
    amountInit,
    amountTicker,
    totalVariation,
    percentTotalVariation,
    sector,
    
  }
  return Ticker
  })
//  console.log(UpdatedStock, 'UpdatedStock')
  return res.json({UpdatedStock})

})
app.delete('/deleteactive/:id', checkToken, async (req, res )=> {
  const {id} = req.params

  await Actives.findByIdAndDelete(id)

  return res.send()
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
app.get('/statement', checkToken, TotalCalculator, Statement)
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

//credential google
async function getAuthSheets(){
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  })

  const client  = await auth.getClient()

  const googleSheets = google.sheets({
    version: 'v4',
    auth: client
  })

  const spreadsheetId = "1XFfFn-bvLbgF1xTWffhVeXnVGWiRkmeEFst1T0A3Jq8"

  return {
    auth,
    client,
    googleSheets,
    spreadsheetId
  }
}


// db credentials
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS
console.log('1' ,dbUser, dbPass)

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.s1s1pe2.mongodb.net/?retryWrites=true&w=majority`)
.then(()=> {
app.listen(port)

  console.log(`Success Conected database on ${port}`)
}).catch((err) => {
  console.log('2', dbUser, dbPass)
  console.log('Erro especificado a baixo')
  console.log(err)
})




