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
const Amounts_1 = __importDefault(require("../models/Amounts"));
function PrivateRoute(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const { TotalFounds, TotalDebits, TotalCredits } = req;
        //check if user exists
        const user = yield User_1.default.findById(id, '-password').populate(['statement']);
        console.log(user.populate('statement'));
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        const customers = yield Amounts_1.default.find({ user: id });
        yield Promise.all(customers.map((customer) => __awaiter(this, void 0, void 0, function* () {
            const userCustomer = new Amounts_1.default(Object.assign(Object.assign({}, customer), { user: user._id }));
            yield userCustomer.save();
            user.statement.push(userCustomer);
        })));
        // console.log(userId)
        //  await user.statement.push(customers)
        res.status(200).json({ user, TotalFounds, TotalDebits, TotalCredits });
    });
}
exports.default = PrivateRoute;
