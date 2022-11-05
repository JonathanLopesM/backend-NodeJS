import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

export default async function  ResetPass (req, res){

  const { id, token } = req.params;
  const { password } = req.body
  console.log(req.params)
  if(!password){
    return res.json({ message: 'Password Required'})
  }

  const oldUser = await User.findOne({ _id: id })
  if(!oldUser) {
    return res.json({ status: "User Not Exists!!" })
  }
  const secret = process.env.SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: passwordHash
        }
      }
    )

      res.redirect(process.env.URL_FRONT)
  } catch (error) {
    console.log(error)
    res.json({ status: "Something Went Wrong"})
  }

}