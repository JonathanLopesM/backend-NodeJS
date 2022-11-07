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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function PasswordGet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, token } = req.params;
        const oldUser = yield User_1.default.findOne({ _id: id });
        console.log(oldUser);
        if (!oldUser) {
            return res.json({ status: "User Not Exists!!" });
        }
        const secret = process.env.SECRET + oldUser.password;
        try {
            const verify = jsonwebtoken_1.default.verify(token, secret);
            res.render("index", { email: verify.email });
        }
        catch (error) {
            console.log(error);
            res.send("Not verified");
        }
    });
}
exports.default = PasswordGet;
