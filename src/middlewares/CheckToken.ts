import jwt, {Secret} from 'jsonwebtoken'

//Middleware
async function checkToken(req, res, next) {

  const authHeader = await req.headers['authorization']
  const token = authHeader && authHeader.split(" ")[1]

  if(!token){
    return res.status(401).json({ msg: "Acesso negado!" })
  }
  //Token validation
  try {

    const secret = process.env.SECRET as Secret
    // console.log(token)
    // console.log(secret)

    jwt.verify(token, secret, (err, decoded) => {
      if(err) return res.status(401).send({ error: 'Token invalid'});
      // console.log(decoded)
      req.userId = decoded.id;
      
      return next()
    })

  } catch (error) {
    res.status(400).json({ msg: "Token Inválido !"})
  }

}

export default checkToken