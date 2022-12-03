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
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const CheckToken_1 = __importDefault(require("./middlewares/CheckToken"));
const LoginUser_1 = __importDefault(require("./controllers/LoginUser"));
const PrivateRoute_1 = __importDefault(require("./controllers/PrivateRoute"));
const RegisterUser_1 = __importDefault(require("./controllers/RegisterUser"));
const RecoverPassword_1 = __importDefault(require("./controllers/RecoverPassword"));
const ResetPass_1 = __importDefault(require("./controllers/ResetPass"));
const ResetPassword_1 = __importDefault(require("./controllers/ResetPassword"));
const Amounts_1 = __importDefault(require("./models/Amounts"));
const TotalCalculator_1 = __importDefault(require("./middlewares/TotalCalculator"));
const GreetTime_1 = require("./middlewares/GreetTime");
const port = process.env.PORT || 3333;
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
app.get('/user/:id', CheckToken_1.default, TotalCalculator_1.default, PrivateRoute_1.default);
//statement
app.get('/statement', CheckToken_1.default, TotalCalculator_1.default, GreetTime_1.GreetTime, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, TotalFounds, TotalDebits, TotalCredits, greet } = req;
    const customer = yield Amounts_1.default.find({ user: userId });
    return res.json({ customer, TotalFounds, TotalDebits, TotalCredits, greet });
}));
//Deposit 
app.post('/deposit', CheckToken_1.default, TotalCalculator_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { description, value, type, date, category } = req.body;
    const { userId, TotalFounds, TotalDebits, TotalCredits } = req;
    var ValueTo = value.replace(".", "");
    var ValueTo2 = ValueTo.replace(",", ".");
    var amount = Number.parseFloat(ValueTo2).toFixed(2);
    const dateform = new Date(date);
    const dateTo = (((dateform.getDate() + 1)) + "/" + ((dateform.getMonth() + 1)) + "/" + dateform.getFullYear()).toString();
    const statement = {
        user: userId,
        description,
        amount,
        type,
        dateTo,
        category
    };
    const CustomerState = yield Amounts_1.default.create(statement);
    return res.json({ CustomerState, TotalFounds, TotalDebits, TotalCredits });
}));
//List Customer
app.put('/updated/:id', CheckToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { description, amount, type } = req.body;
    let debit = yield Amounts_1.default.findByIdAndUpdate(id, {
        description,
        amount,
        type
    });
    return res.json({ debit });
}));
// Delete 
app.delete('/delete/:id', CheckToken_1.default, TotalCalculator_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userId, TotalFounds, TotalDebits, TotalCredits } = req;
    yield Amounts_1.default.findByIdAndDelete(id);
    return res.json({ TotalFounds, TotalDebits, TotalCredits });
}));
//Route Register User 
app.post('/auth/register', RegisterUser_1.default);
//Login User
app.post('/auth/user', TotalCalculator_1.default, GreetTime_1.GreetTime, LoginUser_1.default);
// Recover Password
app.post('/recover', RecoverPassword_1.default);
//Reset
app.get('/reset-password/:id/:token', ResetPassword_1.default);
app.post('/reset-password/:id/:token', ResetPass_1.default);
// db credentials
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
console.log('1', dbUser, dbPass);
mongoose_1.default.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.s1s1pe2.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
    app.listen(port);
    console.log("Success Conected database");
}).catch((err) => {
    console.log('2', dbUser, dbPass);
    console.log('Erro especificado a baixo');
    console.log(err);
});
