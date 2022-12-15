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
function CreateBalance(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { description, value, type, date, category } = req.body;
        const { userId, TotalFounds, TotalDebits, TotalCredits } = req;
        //validations
        if (!description) {
            return res.status(422).json({ message: 'A descrição é obrigatória' });
        }
        if (!value) {
            return res.status(422).json({ message: 'O Valor é obrigatório' });
        }
        if (!category) {
            return res.status(422).json({ message: 'A Categoria é obrigatória' });
        }
        var ValueTo = value.replace(".", "");
        var ValueTo2 = ValueTo.replace(",", ".");
        var amount = Number.parseFloat(ValueTo2).toFixed(2);
        const dateTo = date;
        const balancesheet = {
            user: userId,
            description,
            amount,
            type,
            dateTo,
            category
        };
        const CustomerState = yield Patrimony_1.default.create(balancesheet);
        return res.json({ CustomerState, TotalFounds, TotalDebits, TotalCredits });
    });
}
exports.default = CreateBalance;
