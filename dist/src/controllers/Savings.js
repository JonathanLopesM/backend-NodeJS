"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Savings = void 0;
const SavingsModel_1 = __importDefault(require("../models/SavingsModel"));
const Savings = async (req, res) => {
    const { userId } = req;
    console.log(userId, 'userId directTreasure');
    const { buyValue, dateBuy, codeName, type } = req.body;
    const buyValue3 = buyValue.replaceAll('.', '');
    console.log(buyValue3, 'buyValue3 directTreasure');
    const buyValue2 = Number(buyValue3.replace(',', '.'));
    console.log(buyValue2, 'buyValue2');
    const data = {
        buyValue2, dateBuy,
        codeName, type,
        user: userId
    };
    const response = await SavingsModel_1.default.create(data);
    res.status(200).json({ response });
};
exports.Savings = Savings;
