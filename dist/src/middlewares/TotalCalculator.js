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
        // Get Month atual and Year
        const date = new Date();
        const monthNow = date.getMonth() + 1;
        const yearNow = date.getFullYear();
        //CALCULO DE DEBITOS MONTH AND YEAR
        const customersDebit = customers.filter((obj) => {
            const dateFilter = obj.dateTo.split('/');
            if (monthNow == dateFilter[1] && yearNow == dateFilter[2]) {
                return obj.type === 'debit';
            }
        });
        var valueDebits = customersDebit.map(customer => {
            return customer.amount;
        });
        var TotalDebits = 0;
        for (var i = 0; i < valueDebits.length; i++) {
            TotalDebits += valueDebits[i];
        }
        req.TotalDebits = Number(TotalDebits.toFixed(2));
        //Calculo para o total de -DEBITOS
        const customersDebitAll = customers.filter((obj) => {
            return obj.type === 'debit';
        });
        var valueDebitsAll = customersDebitAll.map(customer => {
            return customer.amount;
        });
        var TotalDebitsAll = 0;
        for (var i = 0; i < valueDebitsAll.length; i++) {
            TotalDebitsAll += valueDebitsAll[i];
        }
        req.TotalDebitsAll = Number(TotalDebitsAll.toFixed(2));
        //Filtro de Mes
        var monthsTypes = customers.map((obj) => {
            const month = obj.dateTo.split('/');
            return month[1];
        });
        var months = monthsTypes.filter((index, i) => {
            return monthsTypes.indexOf(index) === i;
        });
        var TotalToMonth = 0;
        for (i = 0; i < months.length; i++) {
            const credits = customers.filter((obj) => {
                const dateFilter = obj.dateTo.split('/');
                if (months[i] == dateFilter[1]) {
                    return obj.type === 'credit';
                }
            });
            //Criar a Soma Total de cada
            const CreditValue = credits.map(credit => (credit.amount));
            for (i = 0; i < credits.length; i++) {
                TotalToMonth += CreditValue[i];
            }
        }
        // Filter to Month and Year Today
        const customersCredit = customers.filter((obj) => {
            const dateFilter = obj.dateTo.split('/');
            if (monthNow == dateFilter[1] && yearNow == dateFilter[2]) {
                return obj.type === 'credit';
            }
        });
        var valueCredits = customersCredit.map(customer => {
            return customer.amount;
        });
        var TotalCredits = 0;
        for (var i = 0; i < valueCredits.length; i++) {
            TotalCredits += valueCredits[i];
        }
        // console.log(TotalCredits)
        req.TotalCredits = Number(TotalCredits.toFixed(2));
        //Calculo de Creditos total
        const customersCreditAll = customers.filter((obj) => {
            return obj.type === 'credit';
        });
        var valueCreditsMonths = customersCreditAll.map(customer => {
            return customer.amount;
        });
        var TotalCreditsMonth = 0;
        for (var i = 0; i < valueCreditsMonths.length; i++) {
            TotalCreditsMonth += valueCreditsMonths[i];
        }
        //total founds
        var TotalFounds = TotalCreditsMonth - TotalDebitsAll;
        // console.log(TotalFounds)
        req.TotalFounds = Number(TotalFounds.toFixed(2));
        var PercentDebits = 0;
        if (TotalDebits < TotalCredits) {
            PercentDebits = TotalDebits / (TotalCredits / 100);
        }
        else if (TotalCredits < TotalDebits) {
            PercentDebits = TotalCredits / (TotalDebits / 100);
        }
        req.PercentDebits = Number(PercentDebits.toFixed(2));
        var PercentCredits = PercentDebits - 100;
        PercentCredits = Math.abs(PercentCredits);
        req.PercentCredits = Number(PercentCredits.toFixed(2));
        return next();
    });
}
exports.default = TotalCalculator;
