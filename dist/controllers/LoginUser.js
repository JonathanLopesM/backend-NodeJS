"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function LoginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        //validations
        if (!email) {
            return res.status(422).json({ message: 'O Email é obrigatório' });
        }
        if (!password) {
            return res.status(422).json({ message: 'A Senha é obrigatória' });
        }
        //check user exists
        const user = yield User_1.default.findOne({ email: email });
        if (!user) {
            return res.status(422).json({ msg: 'Usuário não encontrado, verifique Email/Senha' });
        }
        //check Password match
        const checkPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!checkPassword) {
            return res.status(422).json({ message: 'Senha Inválida' });
        }
        const UserName = user.name;
        const Name = UserName[0].toUpperCase() + UserName.substring(1);
        const userReturn = {
            id: user.id.toString(),
            name: Name,
            email: user.email,
        };
        console.log(userReturn);
        try {
            const secret = process.env.SECRET;
            const token = jsonwebtoken_1.default.sign({
                id: user._id,
            }, secret);
            res.status(200).json({ msg: 'Autenticação com sucesso', userReturn, token });
        }
        catch (error) {
            res.status(500).json({
                msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!'
            });
        }
    });
}
exports.default = LoginUser;
