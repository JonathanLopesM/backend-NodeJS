"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalcAmount = void 0;
const CalcAmount = async (req, res) => {
    const { yearsTime, taxValue, AmountCalc, AmountCalcInit } = req.body;
    // console.log(yearsTime, taxValue, AmountCalc, AmountCalcInit, 'antes de formatar')
    var taxValueNum = taxValue.replaceAll('.', '');
    var taxValueCorrect = Number(taxValueNum.replace(',', '.'));
    var amountNum = AmountCalc.replaceAll('.', '');
    var amountNumCorrect = Number(amountNum.replace(',', '.'));
    var amountInitNum = AmountCalcInit.replaceAll('.', '');
    var AmountInitCorrect = Number(amountInitNum.replace(',', '.'));
    // console.log(taxValueCorrect, amountNumCorrect, AmountInitCorrect, taxValueCorrect, 'depois de format')
    const investmentAmount = amountNumCorrect - AmountInitCorrect;
    const interestRate = (taxValueCorrect / 12) / 100;
    const months = yearsTime * 12;
    // const monthlyInterestRate = interestRate;
    // console.log(taxValueCorrect, amountNumCorrect, AmountInitCorrect, investmentAmount, interestRate, months , 'dados tratados')
    // const resGuria = ((0.0095 / 1) - 1 ) / ((1+ 0.0095)**480)
    // console.log(resGuria, "calculo ")
    const response = investmentAmount * ((1 + interestRate) ** -1) * (interestRate / (((1 + interestRate) ** months) - 1));
    // console.log(response, 'resultado')
    // console.log(response, 'response ')
    return res.json({ response });
};
exports.CalcAmount = CalcAmount;
