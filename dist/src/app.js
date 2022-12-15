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
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const MulterConfig_1 = require("./MulterConfig");
const multer_1 = __importDefault(require("multer"));
const CheckToken_1 = __importDefault(require("./middlewares/CheckToken"));
const LoginUser_1 = __importDefault(require("./controllers/LoginUser"));
const PrivateRoute_1 = __importDefault(require("./controllers/PrivateRoute"));
const RegisterUser_1 = __importDefault(require("./controllers/RegisterUser"));
const RecoverPassword_1 = __importDefault(require("./controllers/RecoverPassword"));
const ResetPass_1 = __importDefault(require("./controllers/ResetPass"));
const ResetPassword_1 = __importDefault(require("./controllers/ResetPassword"));
const TotalCalculator_1 = __importDefault(require("./middlewares/TotalCalculator"));
const PatrimonyCalculate_1 = __importDefault(require("./middlewares/PatrimonyCalculate"));
const GreetTime_1 = require("./middlewares/GreetTime");
const Statement_1 = __importDefault(require("./controllers/Statement"));
const Deposit_1 = __importDefault(require("./controllers/Deposit"));
const UpdatedWallet_1 = __importDefault(require("./controllers/UpdatedWallet"));
const DeleteWallet_1 = __importDefault(require("./controllers/DeleteWallet"));
const CreateBalance_1 = __importDefault(require("./controllers/CreateBalance"));
const ViewBalance_1 = __importDefault(require("./controllers/ViewBalance"));
const DeleteBalance_1 = __importDefault(require("./controllers/DeleteBalance"));
const TaxModel_1 = __importDefault(require("./models/TaxModel"));
const TaxCalculate_1 = __importDefault(require("./middlewares/TaxCalculate"));
const upload = (0, multer_1.default)({ storage: MulterConfig_1.storage, limits: MulterConfig_1.limits });
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
//Upload Pdf
app.post('/uploadfdna', upload.single('file'), (req, res) => {
    // console.log(req)
    // console.log(req.file)
    return res.json(req.file.filename);
});
// Private Route
app.get('/user/:id', CheckToken_1.default, TotalCalculator_1.default, PrivateRoute_1.default);
//CRUD TAX PLANNING INIT
app.post('/taxplanning', CheckToken_1.default, TaxCalculate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { annualIncome, health, dependents, spendingOnEducation, ContributionPGBL, INSS, withholdingTax } = req.body;
    const taxPlanning = {
        annualIncome,
        health,
        dependents,
        spendingOnEducation,
        ContributionPGBL,
        INSS,
        withholdingTax
    };
    const TaxPlanningCreate = yield TaxModel_1.default.create(taxPlanning);
    return res.json({ TaxPlanningCreate });
}));
//FINANCIAL MANAGEMENT CRUD INIT
app.get('/statement', CheckToken_1.default, TotalCalculator_1.default, GreetTime_1.GreetTime, Statement_1.default);
//Deposit 
app.post('/deposit', CheckToken_1.default, TotalCalculator_1.default, Deposit_1.default);
//List Customer
app.put('/updated/:id', CheckToken_1.default, UpdatedWallet_1.default);
// Delete 
app.delete('/delete/:id', CheckToken_1.default, TotalCalculator_1.default, DeleteWallet_1.default);
//BalanceShet CRUD INIT
app.post('/createBalance', CheckToken_1.default, CreateBalance_1.default);
app.get('/viewbalance', CheckToken_1.default, PatrimonyCalculate_1.default, ViewBalance_1.default);
app.delete('/deletebalance/:id', CheckToken_1.default, TotalCalculator_1.default, DeleteBalance_1.default);
//CRUD USER
//Route Register User 
app.post('/auth/register', RegisterUser_1.default);
//Login User
app.post('/auth/user', TotalCalculator_1.default, GreetTime_1.GreetTime, LoginUser_1.default);
//RESET PASSWORD CRUD
// Recover Password
app.post('/recover', RecoverPassword_1.default);
//Reset Get
app.get('/reset-password/:id/:token', ResetPassword_1.default);
//Reset Create
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
