import User from "../models/User"
import bcrypt from 'bcrypt'

//controller
export default async function UpdatedUser ( req, res ) {
  const { name, email, password, confirmpassword } = req.body

  if(!name){
    return res.status(422).json({ message: 'O nome é obrigatório'})
  }
  if(!email){
    return res.status(422).json({ message: 'O Email é obrigatório'})
  }
  if(!password){
    return res.status(422).json({ message: 'A Senha é obrigatória'})
  }
  if(password !== confirmpassword) {
    return res.status(422).json({ message: 'As senhas não conferem!'})
  }

  // check if User exists 
  const userExists = await User.findOne({email: email})

  if(userExists){
    return res.status(422).json({ message: 'Email já vinculado a uma conta!'})
  }
  // create password
  const salt = await bcrypt.genSalt(12)
  const passwordHash = await bcrypt.hash(password, salt)

  //create User
  const user = new User({
    name,
    email,
    password:passwordHash,
    statement: []
  })
  try {

    await user.save()
    res.status(201).json({message: 'usuario criado com sucesso!'})

  }catch (error) {
      console.log(error)
      res.status(500).json({message: 'Erro no servidores'})
  }
}