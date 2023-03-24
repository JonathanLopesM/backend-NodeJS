import User from "../models/User"
import Amounts from "../models/Amounts"
import bcrypt from "bcrypt"
import jwt,{ Secret } from "jsonwebtoken"

interface IReq {
  greet: string;
}
export default async function LoginUser (req, res ) {
  const started = new Date() as unknown as number
  const { email, password } = req.body
  // Teste com 0
  const { greet }:IReq = req 


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

    const end = new Date() as unknown as number
    console.log(`Took ${end - started}ms`)
    res.status(200).json({msg: 'Autenticação com sucesso', userReturn, token, greet })
  } catch(error) {
    res.status(500).json({
      msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!'
    })
  }

}