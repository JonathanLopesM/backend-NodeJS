"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const projectLifeSchema = new mongoose_1.Schema({
    yearOld: { type: mongoose_1.Schema.Types.Number, require: true },
    retirement: { type: mongoose_1.Schema.Types.Number, require: true },
    ExpectLife: { type: mongoose_1.Schema.Types.Number, require: true },
    ValueMonth: { type: mongoose_1.Schema.Types.Number, require: true },
    montanteInit: { type: mongoose_1.Schema.Types.Number, require: true },
    RetireValue: { type: mongoose_1.Schema.Types.Number, require: true },
    tempoM: { type: mongoose_1.Schema.Types.Number, require: true },
    tempoApos: { type: mongoose_1.Schema.Types.Number, require: true },
    INSSproject: { type: mongoose_1.Schema.Types.Number, require: true },
    otherSourcesFinal: { type: mongoose_1.Schema.Types.Number, require: true },
    taxaM: { type: mongoose_1.Schema.Types.Number, require: true },
    taxaNumber: { type: mongoose_1.Schema.Types.Number, require: true },
    montante: { type: mongoose_1.Schema.Types.Number, require: true },
    ValueApos: { type: mongoose_1.Schema.Types.Number, require: true },
    idadeMilion: { type: mongoose_1.Schema.Types.Number, require: true },
    totalAmountInit: { type: mongoose_1.Schema.Types.Number, require: true },
    gainAmountInit: { type: mongoose_1.Schema.Types.Number, require: true },
    tenYears: { type: mongoose_1.Schema.Types.Number, require: true },
    PortionMin: { type: mongoose_1.Schema.Types.Number, require: true },
    PortionNegative: { type: mongoose_1.Schema.Types.Number, require: true },
    PercentGainTenYears: { type: mongoose_1.Schema.Types.Number },
    PercentGainFees: { type: mongoose_1.Schema.Types.Number },
    PercentGainRetirement: { type: mongoose_1.Schema.Types.Number },
    PercentProjectPatrimony: { type: mongoose_1.Schema.Types.Number },
    dateTo: { type: String, default: Date.now, require: true },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Users',
        require: true
    },
    type: String
});
exports.default = mongoose_1.default.model('ProjectLife', projectLifeSchema, 'projectLife');
