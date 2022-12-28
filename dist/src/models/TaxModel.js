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
const taxSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Users',
        require: true
    },
    annualIncomeCorrect: { type: mongoose_1.Schema.Types.Number, require: true },
    healthCorrect: { type: mongoose_1.Schema.Types.Number, require: true },
    dependentsCorrect: { type: mongoose_1.Schema.Types.Number },
    spendingOnEducation: { type: mongoose_1.Schema.Types.Number },
    Alimony: { type: mongoose_1.Schema.Types.Number },
    ContributionPGBL: { type: mongoose_1.Schema.Types.Number },
    INSS: { type: mongoose_1.Schema.Types.Number },
    withholdingTax: { type: mongoose_1.Schema.Types.Number },
    FirstAliquot: { type: mongoose_1.Schema.Types.Number },
    SecondAliquot: { type: mongoose_1.Schema.Types.Number },
    ThirdAliquot: { type: mongoose_1.Schema.Types.Number },
    FourAliquot: { type: mongoose_1.Schema.Types.Number },
    FiveAliquot: { type: mongoose_1.Schema.Types.Number },
    taxTotal: { type: mongoose_1.Schema.Types.Number },
    NewTaxBase: { type: mongoose_1.Schema.Types.Number },
    taxFirst: { type: mongoose_1.Schema.Types.Number },
    taxSecond: { type: mongoose_1.Schema.Types.Number },
    TaxThirdRate: { type: mongoose_1.Schema.Types.Number },
    TaxFourRate: { type: mongoose_1.Schema.Types.Number },
    TaxFiveRate: { type: mongoose_1.Schema.Types.Number },
    EducationCalc: { type: mongoose_1.Schema.Types.Number },
    PGBLCalc: { type: mongoose_1.Schema.Types.Number },
    TotalDedution: { type: mongoose_1.Schema.Types.Number },
    dependentsCalc: { type: mongoose_1.Schema.Types.Number },
    CorrectAliquot: { type: String },
    AliquoteEffect: { type: mongoose_1.Schema.Types.Number },
    dateform: { type: String },
    dateTo: { type: String, default: Date.now, require: true },
    type: String
});
exports.default = mongoose_1.default.model('Taxs', taxSchema, 'taxs');
