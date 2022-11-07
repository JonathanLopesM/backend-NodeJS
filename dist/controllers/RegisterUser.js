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
//controller
function RegisterUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const userExists = yield User_1.default.findOne({ email: email });
        if (userExists) {
            return res.status(422).json({ message: 'Email já vinculado a uma conta!' });
        }
        // create password
        const salt = yield bcrypt_1.default.genSalt(12);
        const passwordHash = yield bcrypt_1.default.hash(password, salt);
        //create User
        const user = new User_1.default({
            name,
            email,
            password: passwordHash
        });
        try {
            yield user.save();
            res.status(201).json({ message: 'usuario criado com sucesso!' });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Erro no servidores' });
        }
    });
}
exports.default = RegisterUser;
