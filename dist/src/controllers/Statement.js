"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Amounts_1 = __importDefault(require("../models/Amounts"));
async function Statement(req, res) {
    const { userId, TotalFounds, TotalDebits, TotalCredits, greet, PercentDebits, PercentCredits } = req;
    const customer = await Amounts_1.default.find({ user: userId });
    return res.status(200).json({ customer, TotalFounds, TotalDebits, TotalCredits, greet, PercentDebits, PercentCredits });
}
exports.default = Statement;
