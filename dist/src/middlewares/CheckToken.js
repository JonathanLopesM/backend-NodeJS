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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//Middleware
function checkToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authHeader = yield req.headers['authorization'];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            console.log();
            return res.status(401).json({ msg: "Acesso negado!" });
        }
        //Token validation
        try {
            const secret = process.env.SECRET;
            // console.log(token)
            // console.log(secret)
            jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
                if (err)
                    return res.status(401).send({ error: 'Token invalid' });
                // console.log(decoded)
                req.userId = decoded.id;
                return next();
            });
        }
        catch (error) {
            res.status(400).json({ msg: "Token Inválido !" });
        }
    });
}
exports.default = checkToken;
