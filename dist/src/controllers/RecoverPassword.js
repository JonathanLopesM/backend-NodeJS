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
const nodemailer_1 = __importDefault(require("nodemailer"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function RecoverPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email } = req.body;
        if (!email) {
            return res.status(422).json({ message: 'Usúario não existe' });
        }
        const user = yield User_1.default.findOne({ email: email });
        if (!user) {
            return res.status(422).json({ message: 'E-mail não cadastrado' });
        }
        const userEmail = user.email;
        const secret = process.env.SECRET + user.password;
        const token = jsonwebtoken_1.default.sign({ email: user.email, id: user.id }, secret, {
            expiresIn: "5m"
        });
        const link = `${process.env.URL}reset-password/${user.id}/${token}`;
        //console.log(link)
        //membros@finpath.com.br
        var transport = nodemailer_1.default.createTransport({
            host: "mail.finpath.com.br",
            port: 465,
            auth: {
                // USer MailTRAP fake
                // port: 2525
                // user: "c7e2cc28a6f143",
                // pass: "c0ad8d4698e97e"
                user: process.env.EMAIL_FINPATH,
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
            if (err) {
                return res.status(400).json({
                    message: "Erro: E-mail não enviado"
                });
            }
        });
        res.status(200).json({ msg: 'E-mail enviado com sucesso!' });
    });
}
exports.default = RecoverPassword;
