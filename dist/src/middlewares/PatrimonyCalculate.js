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
const Patrimony_1 = __importDefault(require("../models/Patrimony"));
function PatrimonyCalculate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req;
        const balances = yield Patrimony_1.default.find({ user: userId });
        //TOTAL ACTIVES INIT
        const Actives = balances.filter(obj => {
            return obj.type === 'Ativo';
        });
        var valueActives = Actives.map(active => {
            return active.amount;
        });
        var TotalActives = 0;
        for (var i = 0; i < valueActives.length; i++) {
            TotalActives += valueActives[i];
        }
        req.TotalActives = Number(TotalActives.toFixed(2));
        //TOTAL ACTIVES SHEETS
        const activeSheets = balances.filter(obj => {
            return obj.category === 'Ativo Circulante';
        });
        var valueActiveSheets = activeSheets.map(active => {
            return active.amount;
        });
        var TotalActiveSheets = 0;
        for (var i = 0; i < valueActiveSheets.length; i++) {
            TotalActiveSheets += valueActiveSheets[i];
        }
        req.TotalActiveSheets = Number(TotalActiveSheets.toFixed(2));
        //Total Non Actives Sheets
        const nonActiveSheets = balances.filter(obj => {
            return obj.category === 'Ativo Não Circulante';
        });
        var valueNonActiveSheets = nonActiveSheets.map(active => {
            return active.amount;
        });
        var TotalNonActiveSheets = 0;
        for (var i = 0; i < valueNonActiveSheets.length; i++) {
            TotalNonActiveSheets += valueNonActiveSheets[i];
        }
        req.TotalNonActiveSheets = Number(TotalNonActiveSheets.toFixed(2));
        //TOTAL PASSIVES INIT
        const Passives = balances.filter(obj => {
            return obj.type === 'Passivo';
        });
        var valuePassives = Passives.map(passive => {
            return passive.amount;
        });
        var TotalPassives = 0;
        for (var i = 0; i < valuePassives.length; i++) {
            TotalPassives += valuePassives[i];
        }
        req.TotalPassives = Number(TotalPassives.toFixed(2));
        //TOTAL ACTIVES SHEETS
        const passiveSheets = balances.filter(obj => {
            return obj.category === 'Passivo Circulante';
        });
        var valuePassiveSheets = passiveSheets.map(active => {
            return active.amount;
        });
        var TotalPassiveSheets = 0;
        for (var i = 0; i < valuePassiveSheets.length; i++) {
            TotalPassiveSheets += valuePassiveSheets[i];
        }
        req.TotalPassiveSheets = Number(TotalPassiveSheets.toFixed(2));
        //Total Non Passive Sheets
        const nonPassiveSheets = balances.filter(obj => {
            return obj.category === 'Passivo Não Circulante';
        });
        var valueNonPassiveSheets = nonPassiveSheets.map(active => {
            return active.amount;
        });
        var TotalNonPassiveSheets = 0;
        for (var i = 0; i < valueNonPassiveSheets.length; i++) {
            TotalNonPassiveSheets += valueNonPassiveSheets[i];
        }
        req.TotalNonPassiveSheets = Number(TotalNonPassiveSheets.toFixed(2));
        //ILC 
        const ILC = TotalActiveSheets / TotalPassiveSheets;
        req.ILC = Number(ILC.toFixed(2));
        // IE 
        const IE = TotalPassives / TotalActives;
        req.IE = Number(IE.toFixed(2));
        //TOTAL PATRIMONY INIT
        var TotalPatrimony = TotalActives - TotalPassives;
        req.TotalPatrimony = Number(TotalPatrimony.toFixed(2));
        //TOTAL PATRIMONY FINNALY
        return next();
    });
}
exports.default = PatrimonyCalculate;
