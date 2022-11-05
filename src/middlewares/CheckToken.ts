import jwt, {Secret} from 'jsonwebtoken'

//Middleware
function checkToken(req, res, next) {

  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(" ")[1]

  if(!token){
    return res.status(401).json({ msg: "Acesso negado!" })
  }
  //Token validation
  try {

    const secret = process.env.SECRET as Secret
    // console.log(token)
    // console.log(secret)

    jwt.verify(token, secret)
    next()



  } catch (error) {
    res.status(400).json({ msg: "Token Inválido !"})
  }

}

export default checkToken