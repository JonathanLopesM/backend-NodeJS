import Wallet from "@models/Wallet"



export default async function CreateWallet ( req, res) {
  const {value, description, category, date} = req.body

  if(!value){
    return res.status(422).json({ message: 'O nome é obrigatório'})
  }

  const walletExists = await Wallet.findOne({value: value})

  if(!walletExists){
    
    const wallet = new Wallet({
      value,
      description,
      category,
      date

    })
    await wallet.save()
  }

  
  try {


    res.status(201).json({message: 'usuario criado com sucesso!'})

  }catch (error) {
      console.log(error)
      res.status(500).json({message: 'Erro no servidores'})
  }
}