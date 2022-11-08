"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//Middleware
function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ msg: "Acesso negado!" });
    }
    //Token validation
    try {
        const secret = process.env.SECRET;
        // console.log(token)
        // console.log(secret)
        jsonwebtoken_1.default.verify(token, secret);
        next();
    }
    catch (error) {
        res.status(400).json({ msg: "Token Inválido !" });
    }
}
exports.default = checkToken;
