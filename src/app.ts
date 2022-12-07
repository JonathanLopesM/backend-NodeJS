require('dotenv').config()

import cors from 'cors'
import express from 'express'
import bcrypt from 'bcrypt'
import mongoose, { Schema } from 'mongoose'
import jwt, { Secret } from 'jsonwebtoken'

import User from './models/User'

import checkToken from './middlewares/CheckToken'

import LoginUser from './controllers/LoginUser'
import PrivateRoute from './controllers/PrivateRoute'
import RegisterUser from './controllers/RegisterUser'
import RecoverPassword from './controllers/RecoverPassword'
import ResetPass from './controllers/ResetPass'
import ResetPassword from './controllers/ResetPassword'

import Amounts from './models/Amounts'
import TotalCalculator from './middlewares/TotalCalculator'
import { GreetTime } from './middlewares/GreetTime'

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

// Private Route
app.get('/user/:id', checkToken, TotalCalculator, PrivateRoute )

//statement
app.get('/statement', checkToken, TotalCalculator, GreetTime, async (req, res)=> {
  const { userId, TotalFounds, TotalDebits, TotalCredits , greet} = req as any  

  const customer = await Amounts.find({user:userId})

  return res.json({customer,TotalFounds, TotalDebits, TotalCredits, greet})
})

//Deposit 
app.post('/deposit', checkToken, TotalCalculator, async (req, res) => {
  const { description, value, type, date, category } = req.body;
  const { userId, TotalFounds, TotalDebits, TotalCredits} = req as any
  var ValueTo = value.replace(".", "")
  var ValueTo2 = ValueTo.replace(",", ".")
   var amount = Number.parseFloat(ValueTo2).toFixed(2)

  const dateform = new Date(date)
  const dateTo = (((dateform.getDate() +1 )) + "/" + ((dateform.getMonth() + 1)) + "/" + dateform.getFullYear()).toString(); 


  const statement = {
    user:userId,
    description,
    amount,
    type,
    dateTo,
    category
  } 


  const CustomerState = await Amounts.create(statement)

  return res.json({ CustomerState, TotalFounds, TotalDebits, TotalCredits })
})
//List Customer
app.put('/updated/:id', checkToken, async (req, res ) => {
  const { id } = req.params
  const { description, amount, type } = req.body

  let debit = await Amounts.findByIdAndUpdate(id, {
    description,
    amount,
    type
  })
  return res.json({ debit})
})
// Delete 
app.delete('/delete/:id', checkToken, TotalCalculator, async (req, res) => {
  const { id } = req.params
  const { userId, TotalFounds, TotalDebits, TotalCredits } = req as any

   await Amounts.findByIdAndDelete(id)
  return res.json({ TotalFounds, TotalDebits, TotalCredits})
})




//Route Register User 
app.post('/auth/register', RegisterUser)


//Login User
app.post('/auth/user', TotalCalculator, GreetTime, LoginUser)

// Recover Password
app.post('/recover', RecoverPassword)

//Reset
app.get('/reset-password/:id/:token', ResetPassword)

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




