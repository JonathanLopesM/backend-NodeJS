import User from "../models/User";
import {Request, Response } from "express"
import Amounts from "../models/Amounts";


export default async function PrivateRoute (req:Request, res: Response){
  
    const id = req.params.id;

    const { TotalFounds, TotalDebits, TotalCredits } = req as any
    //check if user exists
    const user = await User.findById(id, '-password').populate(['statement'])
    console.log(user.populate('statement'))
    if(!user){
      return res.status(404).json({ message: 'Usuário não encontrado'})
    }
    const customers = await Amounts.find({user: id})

    await Promise.all(customers.map(async customer => {
      const userCustomer = new Amounts({ ...customer, user: user._id })

      await userCustomer.save()

      user.statement.push(userCustomer)
    }))

  // console.log(userId)
    
  //  await user.statement.push(customers)

  
    res.status(200).json({ user, TotalFounds, TotalDebits, TotalCredits })
  
}
