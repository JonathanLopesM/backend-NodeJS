"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function TaxCalculate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req;
        const { annualIncome, health, dependents, spendingOnEducation, ContributionPGBL, INSS, withholdingTax } = req.body;
        //Dependents Calc
        const dependentsCalc = dependents * 2275.08;
        req.dependentsCalc = Number(dependentsCalc.toFixed(2));
        // Spending On Education Calc
        const MaxEducationCalc = 3561.50 * (dependents + 1);
        var EducationCalc = 0;
        if (spendingOnEducation > MaxEducationCalc) {
            EducationCalc = MaxEducationCalc;
        }
        else {
            EducationCalc = spendingOnEducation;
        }
        //PGBL Calc
        const MaxContributionPGBL = annualIncome * 0.12;
        var PGBLCalc = 0;
        if (ContributionPGBL > MaxContributionPGBL) {
            PGBLCalc = MaxContributionPGBL;
        }
        else {
            PGBLCalc = ContributionPGBL;
        }
        //New Tax Base 
        const NewTaxBase = annualIncome - health - INSS - dependentsCalc - PGBLCalc - EducationCalc;
        req.NewTaxBase = Number(NewTaxBase.toFixed(2));
        console.log(annualIncome, health, dependents, spendingOnEducation, ContributionPGBL, INSS, withholdingTax, 'TaxCalculate');
        next();
    });
}
exports.default = TaxCalculate;
