"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function LoginUser(req, res) {
    const started = new Date();
    const { email, password } = req.body;
    // Teste com 0
    const { greet } = req;
    //validations
    if (!email) {
        return res.status(422).json({ message: 'O Email é obrigatório' });
    }
    if (!password) {
        return res.status(422).json({ message: 'A Senha é obrigatória' });
    }
    //check user exists
    const user = await User_1.default.findOne({ email: email });
    if (!user) {
        return res.status(422).json({ msg: 'Usuário não encontrado, verifique Email/Senha' });
    }
    const checkPassword = await bcrypt_1.default.compare(password, user.password);
    if (!checkPassword) {
        return res.status(422).json({ message: 'Senha Inválida' });
    }
    if (user.active === 0) {
        return res.status(422).json({ message: 'Tempo de desgustação expirado, entrar em contato com Suporte.' });
    }
    const UserName = user.name;
    const Name = UserName[0].toUpperCase() + UserName.substring(1);
    const userReturn = {
        id: user.id.toString(),
        name: Name,
        email: user.email,
    };
    //console.log(userReturn)
    try {
        const secret = process.env.SECRET;
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
        }, secret);
        const end = new Date();
        console.log(`Took ${end - started}ms`);
        res.status(200).json({ msg: 'Autenticação com sucesso', userReturn, token, greet });
    }
    catch (error) {
        res.status(500).json({
            msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!'
        });
    }
}
exports.default = LoginUser;
