"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Amounts_1 = __importDefault(require("../models/Amounts"));
async function UpdatedWallet(req, res) {
    const { id } = req.params;
    const { description, amount, type } = req.body;
    let debit = await Amounts_1.default.findByIdAndUpdate(id, {
        description,
        amount,
        type
    });
    return res.json({ debit });
}
exports.default = UpdatedWallet;
