require('dotenv').config()

import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import {storage, limits} from './MulterConfig'
import multer from 'multer'

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

//CRUD TAX PLANNING INIT
app.post('/taxplanning', checkToken, TaxCalculate, async (req, res) => {
  const { userId, annualIncomeCorrect,healthCorrect, 
    dependentsCorrect, spendingOnEducation, Alimony,
    ContributionPGBL, INSS,withholdingTax,
     FirstAliquot, SecondAliquot, 
    ThirdAliquot, FourAliquot, FiveAliquot,
    taxTotal, NewTaxBase, taxFirst, taxSecond, TaxThirdRate, TaxFourRate, TaxFiveRate,
     EducationCalc,PGBLCalc,dependentsCalc, TotalDedution,CorrectAliquot,AliquoteEffect
    }= req as any
  // console.log(FirstAliquot, SecondAliquot, ThirdAliquot, FourAliquot, FiveAliquot,taxTotal, taxFirst, taxSecond ,NewTaxBase,EducationCalc,PGBLCalc,dependentsCalc, 'na rota')

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
    taxTotal, NewTaxBase, taxFirst, taxSecond,TaxThirdRate, TaxFourRate, TaxFiveRate,
    EducationCalc,PGBLCalc,dependentsCalc, TotalDedution,CorrectAliquot,AliquoteEffect
  }

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
    taxTotal, NewTaxBase, taxFirst, taxSecond,TaxThirdRate, TaxFourRate, TaxFiveRate,EducationCalc,PGBLCalc,dependentsCalc, TotalDedution,CorrectAliquot,AliquoteEffect
    }= req as any
   console.log(FirstAliquot, SecondAliquot, ThirdAliquot, FourAliquot, FiveAliquot,taxTotal, taxFirst, taxSecond ,NewTaxBase,EducationCalc,PGBLCalc,dependentsCalc, TotalDedution, 'na rota')

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
    taxTotal, NewTaxBase, taxFirst, taxSecond,TaxThirdRate, TaxFourRate, TaxFiveRate,
    EducationCalc, PGBLCalc, dependentsCalc,TotalDedution, CorrectAliquot,AliquoteEffect 
  }
  
  const response = await TaxModel.findByIdAndUpdate(id, taxPlanning, {new:true})

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




