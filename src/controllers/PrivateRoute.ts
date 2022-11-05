import User from "../models/User";
import {Request, Response } from "express"


export default async function PrivateRoute (req:Request, res: Response){
  
    const id = req.params.id;
    //check if user exists
    const user = await User.findById(id, '-password')
    console.log(user)
    if(!user){
      return res.status(404).json({ message: 'Usuário não encontrado'})
    }
  
    res.status(200).json({ user })
  
}
