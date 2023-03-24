"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Amounts_1 = __importDefault(require("../models/Amounts"));
async function DeleteWallet(req, res) {
    const { id } = req.params;
    const { userId, TotalFounds, TotalDebits, TotalCredits } = req;
    await Amounts_1.default.findByIdAndDelete(id);
    return res.json({ TotalFounds, TotalDebits, TotalCredits });
}
exports.default = DeleteWallet;
