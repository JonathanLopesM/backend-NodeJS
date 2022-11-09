require('dotenv').config()

import express from 'express'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import jwt, { Secret } from 'jsonwebtoken'
import cors from 'cors'

import User from './models/User'

import checkToken from './middlewares/CheckToken'

import LoginUser from './controllers/LoginUser'
import PrivateRoute from './controllers/PrivateRoute'
import RegisterUser from './controllers/RegisterUser'
import RecoverPassword from './controllers/RecoverPassword'
import ResetPass from './controllers/ResetPass'
import ResetPassword from './controllers/ResetPassword'

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
app.get('/user/:id', checkToken, PrivateRoute)

//Register User 
app.post('/auth/register', RegisterUser)

//Login User
app.post('/auth/user', LoginUser)

// Recover Password
app.post('/recover', RecoverPassword)

app.post('/forgot_password', async (req, res) => {
  const { email } = req.body
  try {
    const user = await User.findOne({ email })
    console.log(user)

    if(!user){
      return res.status(400).send({ error: 'User not found' })
    }
     const token = bcrypt.hash(user.id, 20)
    // console.log(token)

    const now = new Date()
    const date = now.setHours(now.getHours() + 1)
    console.log(user.id)

    // await User.updateOne(
    //   {
    //     _id: user.id,
    //   },
    //   {
    //     $set: {
    //       passwordResetToken: token,
    //       passwordResetExpires: now,
    //     }
    //   }
    // )

    // await User.findByIdAndUpdate(user.id, {
    //   '$set': {
    //     passwordResetToken: token,
    //     passwordResetExpires: now,
    //   }
    //})

    console.log(token, date)

    res.status(200).send({ message :'Ok '})
  } catch (error) {
    res.status(400).send({ error: 'Erro on forgot password, try again'})
  }
})

//Reset
app.get('/reset-password/:id/:token', ResetPassword)

app.post('/reset-password/:id/:token', ResetPass)




// db credentials
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS
console.log('1' ,dbUser, dbPass)

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.evpyhzo.mongodb.net/?retryWrites=true&w=majority`)
.then(()=> {
app.listen(port)

  console.log("Success Conected database")
}).catch((err) => {
  console.log('2', dbUser, dbPass)
  console.log('Erro especificado a baixo')
  console.log(err)
})




