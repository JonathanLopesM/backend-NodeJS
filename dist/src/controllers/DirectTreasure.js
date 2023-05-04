"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectTreasure = void 0;
const DirectTreasureModel_1 = __importDefault(require("../models/DirectTreasureModel"));
const DirectTreasure = async (req, res) => {
    const { userId } = req;
    // console.log(userId, 'userId directTreasure')
    const { buyValue, amount, dateBuy, dateSell, codeName, type } = req.body;
    const buyValue3 = buyValue.replaceAll('.', '');
    const buyValue2 = Number(buyValue3.replace(',', '.'));
    console.log(amount, 'amount do post');
    let amountNum = 0;
    if (amount === Number) {
        amountNum = Number(amount.replace(',', '.'));
    }
    else {
        amountNum = amount.replaceAll('.', '');
        amountNum = Number(amountNum.replace(',', '.'));
    }
    const data = {
        buyValue2, amountNum, dateBuy,
        dateSell, codeName, type,
        user: userId
    };
    const response = await DirectTreasureModel_1.default.create(data);
    res.status(200).json({ response });
};
exports.DirectTreasure = DirectTreasure;
