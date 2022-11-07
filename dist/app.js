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
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const User_1 = __importDefault(require("./models/User"));
const CheckToken_1 = __importDefault(require("./middlewares/CheckToken"));
const LoginUser_1 = __importDefault(require("./controllers/LoginUser"));
const PrivateRoute_1 = __importDefault(require("./controllers/PrivateRoute"));
const RegisterUser_1 = __importDefault(require("./controllers/RegisterUser"));
const RecoverPassword_1 = __importDefault(require("./controllers/RecoverPassword"));
const ResetPass_1 = __importDefault(require("./controllers/ResetPass"));
const ResetPassword_1 = __importDefault(require("./controllers/ResetPassword"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.set("view engine", "ejs");
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/images', express_1.default.static('images'));
// Router Public
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Bem vindo a nossa API' });
});
// Private Route
app.get('/user/:id', CheckToken_1.default, PrivateRoute_1.default);
//Register User 
app.post('/auth/register', RegisterUser_1.default);
//Login User
app.post('/auth/user', LoginUser_1.default);
// Recover Password
app.post('/recover', RecoverPassword_1.default);
app.post('/forgot_password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }
        const token = bcrypt_1.default.hash(user.id, 20);
        // console.log(token)
        const now = new Date();
        const date = now.setHours(now.getHours() + 1);
        console.log(user.id);
        // await User.updateOne(
        //   {
        //     _id: user.id,
        //   },
        //   {
        //     $set: {
        //       passwordResetToken: token,
        //       passwordResetExpires: now,
        //     }
        //   }
        // )
        // await User.findByIdAndUpdate(user.id, {
        //   '$set': {
        //     passwordResetToken: token,
        //     passwordResetExpires: now,
        //   }
        //})
        console.log(token, date);
        res.status(200).send({ message: 'Ok ' });
    }
    catch (error) {
        res.status(400).send({ error: 'Erro on forgot password, try again' });
    }
}));
//Reset
app.get('/reset-password/:id/:token', ResetPassword_1.default);
app.post('/reset-password/:id/:token', ResetPass_1.default);
// db credentials
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
mongoose_1.default.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.evpyhzo.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
    app.listen(3333);
    console.log("Success Conected database");

}).catch((err) => {
    console.log(dbUser, dbPass)
    console.log('Erro especificado a baixo')
    console.log(err)
});
