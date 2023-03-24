"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
async function ResetPass(req, res) {
    const { id, token } = req.params;
    const { password } = req.body;
    console.log(req.params);
    if (!password) {
        return res.json({ message: 'Password Required' });
    }
    const oldUser = await User_1.default.findOne({ _id: id });
    if (!oldUser) {
        return res.json({ status: "User Not Exists!!" });
    }
    const secret = process.env.SECRET + oldUser.password;
    try {
        const verify = jsonwebtoken_1.default.verify(token, secret);
        const salt = await bcrypt_1.default.genSalt(12);
        const passwordHash = await bcrypt_1.default.hash(password, salt);
        await User_1.default.updateOne({
            _id: id,
        }, {
            $set: {
                password: passwordHash
            }
        });
        res.redirect(process.env.URL_FRONT);
    }
    catch (error) {
        console.log(error);
        res.json({ status: "Something Went Wrong" });
    }
}
exports.default = ResetPass;
