"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectTreasure = void 0;
const DirectTreasureModel_1 = __importDefault(require("../models/DirectTreasureModel"));
const DirectTreasure = async (req, res) => {
    const { userId } = req;
    console.log(userId, 'userId directTreasure');
    const { buyValue, amount, dateBuy, dateSell, codeName, type } = req.body;
    const buyValue3 = buyValue.replaceAll('.', '');
    console.log(buyValue3, 'buyValue3 directTreasure');
    const buyValue2 = Number(buyValue3.replace(',', '.'));
    console.log(buyValue2, 'buyValue2');
    const data = {
        buyValue2, amount, dateBuy,
        dateSell, codeName, type,
        user: userId
    };
    const response = await DirectTreasureModel_1.default.create(data);
    res.status(200).json({ response });
};
exports.DirectTreasure = DirectTreasure;
