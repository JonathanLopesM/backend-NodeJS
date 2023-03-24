"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Patrimony_1 = __importDefault(require("../models/Patrimony"));
async function ViewBalance(req, res) {
    const { userId, TotalFounds, TotalDebits, TotalCredits, TotalActives, TotalPassives, TotalPatrimony, TotalActiveSheets, TotalNonActiveSheets, TotalPassiveSheets, TotalNonPassiveSheets, ILC, IE } = req;
    const balance = await Patrimony_1.default.find({ user: userId });
    return res.json({ balance, TotalFounds, TotalDebits, TotalCredits, TotalActives, TotalPassives, TotalPatrimony, TotalActiveSheets, TotalNonActiveSheets, TotalPassiveSheets, TotalNonPassiveSheets, ILC, IE });
}
exports.default = ViewBalance;
