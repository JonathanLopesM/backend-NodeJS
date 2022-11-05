import User from "../models/User"
import jwt from "jsonwebtoken"

export default async function PasswordGet (req, res) {
  const { id, token } = req.params
  const oldUser = await User.findOne({ _id: id })
  console.log(oldUser)
  if(!oldUser){
    return res.json({ status: "User Not Exists!!"})
  }
  const secret = process.env.SECRET + oldUser.password
  try {
    const verify = jwt.verify(token, secret)

    res.render("index", { email:verify.email})
  } catch (error) {
    console.log(error)
    res.send("Not verified")
  }
}