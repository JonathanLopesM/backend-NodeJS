"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
//controller
async function UpdatedUser(req, res) {
    const { name, email, password, confirmpassword } = req.body;
    if (!name) {
        return res.status(422).json({ message: 'O nome é obrigatório' });
    }
    if (!email) {
        return res.status(422).json({ message: 'O Email é obrigatório' });
    }
    if (!password) {
        return res.status(422).json({ message: 'A Senha é obrigatória' });
    }
    if (password !== confirmpassword) {
        return res.status(422).json({ message: 'As senhas não conferem!' });
    }
    // check if User exists 
    const userExists = await User_1.default.findOne({ email: email });
    if (userExists) {
        return res.status(422).json({ message: 'Email já vinculado a uma conta!' });
    }
    // create password
    const salt = await bcrypt_1.default.genSalt(12);
    const passwordHash = await bcrypt_1.default.hash(password, salt);
    //create User
    const user = new User_1.default({
        name,
        email,
        password: passwordHash,
        statement: []
    });
    try {
        await user.save();
        res.status(201).json({ message: 'usuario criado com sucesso!' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erro no servidores' });
    }
}
exports.default = UpdatedUser;
