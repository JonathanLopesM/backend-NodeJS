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
const Amounts_1 = __importDefault(require("../models/Amounts"));
function TotalCalculator(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req;
        // console.log(userId)
        //Array to Wallet
        const customers = yield Amounts_1.default.find({ user: userId });
        //Calculo para o total de -DEBITOS
        const customersDebit = customers.filter((obj) => {
            return obj.type === 'debit';
        });
        var valueDebits = customersDebit.map(customer => {
            return customer.amount;
        });
        var TotalDebits = 0;
        for (var i = 0; i < valueDebits.length; i++) {
            TotalDebits += valueDebits[i];
        }
        // console.log(TotalDebits)
        req.TotalDebits = TotalDebits;
        //Calculo de Creditos
        const customersCredit = customers.filter((obj) => {
            return obj.type === 'credit';
        });
        var valueCredits = customersCredit.map(customer => {
            return customer.amount;
        });
        var TotalCredits = 0;
        for (var i = 0; i < valueCredits.length; i++) {
            TotalCredits += valueCredits[i];
        }
        // console.log(TotalCredits)
        req.TotalCredits = TotalCredits;
        var TotalFounds = TotalCredits - TotalDebits;
        // console.log(TotalFounds)
        req.TotalFounds = TotalFounds;
        return next();
    });
}
exports.default = TotalCalculator;
