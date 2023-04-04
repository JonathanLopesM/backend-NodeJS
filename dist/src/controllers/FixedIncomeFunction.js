"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedIncomeFunction = void 0;
const FixedIncome_1 = __importDefault(require("../models/FixedIncome"));
const FixedIncomeFunction = async (req, res) => {
    const { userId } = req;
    const { buyValue, percentAmount, dateBuy, dateSell, codeName, type } = req.body;
    const buyValue3 = buyValue.replaceAll('.', '');
    console.log(buyValue3, 'buyValue3');
    const buyValue2 = Number(buyValue3.replace(',', '.'));
    console.log(buyValue2, 'buyValue2');
    const data = {
        buyValue2, percentAmount, dateBuy,
        dateSell, codeName, type,
        user: userId
    };
    const response = await FixedIncome_1.default.create(data);
    res.status(200).json({ response });
};
exports.FixedIncomeFunction = FixedIncomeFunction;
