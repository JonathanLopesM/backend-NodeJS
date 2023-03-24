"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Patrimony_1 = __importDefault(require("../models/Patrimony"));
async function DeleteBalance(req, res) {
    const { id } = req.params;
    const { userId, TotalFounds, TotalDebits, TotalCredits } = req;
    await Patrimony_1.default.findByIdAndDelete(id);
    return res.json({ TotalFounds, TotalDebits, TotalCredits });
}
exports.default = DeleteBalance;
