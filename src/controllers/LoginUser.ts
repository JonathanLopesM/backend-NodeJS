import User from "../models/User"
import Amounts from "../models/Amounts"
import bcrypt from "bcrypt"
import jwt,{ Secret } from "jsonwebtoken"

export default async function LoginUser (req, res ) {
  const { email, password } = req.body
  // Teste com 0
  const { TotalFounds, TotalDebits, TotalCredits, greet } = req as any


  //validations
    if(!email){
      return res.status(422).json({ message: 'O Email é obrigatório'})
    }
    if(!password){
      return res.status(422).json({ message: 'A Senha é obrigatória'})
    }
  
  //check user exists
  const user = await User.findOne({ email: email})
  if(!user) {
    return res.status(422).json({ msg: 'Usuário não encontrado, verifique Email/Senha'})
  }


  //check Password match

  const checkPassword = await bcrypt.compare(password, user.password)

  if(!checkPassword) {
    return res.status(422).json({ message: 'Senha Inválida' })
  }
  const UserName = user.name
  const Name = UserName[0].toUpperCase() + UserName.substring(1)

  const userReturn = {
    id: user.id.toString(),
    name: Name,
    email: user.email,

  }
  //console.log(userReturn)
  
  
  try{

    const secret = process.env.SECRET as Secret
    const token = jwt.sign({
      id:user._id,
    },
    secret,
    )
    res.status(200).json({msg: 'Autenticação com sucesso', userReturn, token, TotalFounds, TotalDebits, TotalCredits, greet })
  } catch(error) {
    res.status(500).json({
      msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!'
    })
  }

}