import nodemailer from 'nodemailer'
import User from '../models/User';
import  jwt  from 'jsonwebtoken';

export default async function RecoverPassword(req, res) {
  const {email} = req.body

  if(!email){
    return res.status(422).json({ message: 'Usúario não existe'})
  }

  const user = await User.findOne({ email: email})
  if(!user){
    return res.status(422).json({ message: 'E-mail não cadastrado'})
  }
  
  const userEmail = user.email
  const secret =  process.env.SECRET + user.password;
  const token = jwt.sign({ email: user.email, id: user.id }, secret, {
    expiresIn: "5m"
  })
  const link =`${process.env.URL}/reset-password/${user.id}/${token}`

  console.log(link)
  //membros@finpath.com.br

  var transport = nodemailer.createTransport({
    host: "mail.finpath.com.br",
    port: 465,
    auth: {
      // USer MailTRAP fake
      // port: 2525
      // user: "c7e2cc28a6f143",
      // pass: "c0ad8d4698e97e"
      user: process.env.EMAIL_FINPATH , 
      pass: process.env.PASSWORD_FINPATH
    }
  });
  var message = {
    from: process.env.EMAIL_FINPATH,
    to: userEmail,
    subject: "Redefinir senha - Finpath",
    text: "Redefinir senha - Finpath",
    html: `<h1>Redefinição de senha</h1>
            <p>Você solicitou a redefinição de sua senha</p> <br> 
            <p>Acesse esse link para redefinir sua senha <a href=${link}>Redefinir Senha</a> </p> 
            <br> <h2>Dúvidas pelo contato:</h2> <br>
            Telefone: (11)98543-4460 <br>
            E-mail: contato@finpath.com.br
            `
  };
  
  transport.sendMail(message, (err) => {
    if(err){
      return res.status(400).json({
        message: "Erro: E-mail não enviado"
      })

    }
  })

    res.status(200).json({ msg: 'E-mail enviado com sucesso!'})
} 