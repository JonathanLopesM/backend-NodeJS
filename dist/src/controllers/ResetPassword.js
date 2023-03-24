"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function PasswordGet(req, res) {
    const { id, token } = req.params;
    const oldUser = await User_1.default.findOne({ _id: id });
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
}
exports.default = PasswordGet;
