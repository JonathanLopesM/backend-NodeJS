"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const MulterConfig_1 = require("./MulterConfig");
const multer_1 = __importDefault(require("multer"));
const axios_1 = __importDefault(require("axios"));
// import { GoogleSpreadsheet } from 'google-spreadsheet'
const dadosFixed_json_1 = __importDefault(require("../dadosFixed.json"));
const TaxModel_1 = __importDefault(require("./models/TaxModel"));
const Actives_1 = __importDefault(require("./models/Actives"));
const FixedIncome_1 = __importDefault(require("./models/FixedIncome"));
const ProjectLife_1 = __importDefault(require("./models/ProjectLife"));
const ChartsTime_1 = __importDefault(require("./models/ChartsTime"));
const DirectTreasureModel_1 = __importDefault(require("./models/DirectTreasureModel"));
const StocksModel_1 = __importDefault(require("./models/StocksModel"));
const CheckToken_1 = __importDefault(require("./middlewares/CheckToken"));
const TotalCalculator_1 = __importDefault(require("./middlewares/TotalCalculator"));
const PatrimonyCalculate_1 = __importDefault(require("./middlewares/PatrimonyCalculate"));
const GreetTime_1 = require("./middlewares/GreetTime");
const TaxCalculate_1 = __importDefault(require("./middlewares/TaxCalculate"));
const LoginUser_1 = __importDefault(require("./controllers/LoginUser"));
const PrivateRoute_1 = __importDefault(require("./controllers/PrivateRoute"));
const RegisterUser_1 = __importDefault(require("./controllers/RegisterUser"));
const RecoverPassword_1 = __importDefault(require("./controllers/RecoverPassword"));
const ResetPass_1 = __importDefault(require("./controllers/ResetPass"));
const ResetPassword_1 = __importDefault(require("./controllers/ResetPassword"));
const Statement_1 = __importDefault(require("./controllers/Statement"));
const Deposit_1 = __importDefault(require("./controllers/Deposit"));
const UpdatedWallet_1 = __importDefault(require("./controllers/UpdatedWallet"));
const DeleteWallet_1 = __importDefault(require("./controllers/DeleteWallet"));
const CreateBalance_1 = __importDefault(require("./controllers/CreateBalance"));
const ViewBalance_1 = __importDefault(require("./controllers/ViewBalance"));
const DeleteBalance_1 = __importDefault(require("./controllers/DeleteBalance"));
const CalcAmount_1 = require("./controllers/CalcAmount");
const CreateAposent_1 = require("./controllers/CreateAposent");
const FixedIncomeFunction_1 = require("./controllers/FixedIncomeFunction");
const DirectTreasure_1 = require("./controllers/DirectTreasure");
const Savings_1 = require("./controllers/Savings");
const SavingsModel_1 = __importDefault(require("./models/SavingsModel"));
const googleapis_1 = require("googleapis");
const upload = (0, multer_1.default)({ storage: MulterConfig_1.storage, limits: MulterConfig_1.limits });
const port = process.env.PORT || 3334;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.set("view engine", "ejs");
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/images', express_1.default.static('images'));
// Router Public
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Bem vindo a nossa API' });
});
//Upload Pdf
app.post('/uploadfdna', upload.single('file'), (req, res) => {
    // console.log(req)
    // console.log(req.file)
    return res.json(req.file.filename);
});
// Private Route
app.get('/user/:id', CheckToken_1.default, TotalCalculator_1.default, PrivateRoute_1.default);
app.get("/metadata", async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();
    const metadata = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    });
    res.send(metadata.data);
});
app.get('/getbrasiltax', async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();
    const JurosBrasil = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Bancos!AW3:AX",
        valueRenderOption: "UNFORMATTED_VALUE"
    });
    const data = JurosBrasil.data;
    res.status(200).json({ data });
});
app.post('/v1/stock', CheckToken_1.default, async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();
    const { stockcode, valueUnit, amount, buydate } = req.body;
    const { userId } = req;
    const getSTOCKs = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Bancos!AN2:AP",
        valueRenderOption: "UNFORMATTED_VALUE"
    });
    console.log(getSTOCKs.data, 'stocks da planilha');
    const stockdata = getSTOCKs.data.values;
    const stockAdd = stockdata.filter(obj => {
        if (stockcode.toLocaleUpperCase() === obj[0]) {
            return obj;
        }
    });
    console.log(stockAdd, 'objeto com a cotação');
    const dateSave = {
        stockCode: stockcode.toLocaleUpperCase(),
        valueUnit,
        amount,
        buydate,
        user: userId
    };
    const StockRes = await StocksModel_1.default.create(dateSave);
    res.status(200).json({ StockRes });
});
app.get('/v1/stock/:userId', CheckToken_1.default, async (req, res) => {
    const { userId } = req.params;
    const dateValues = await StocksModel_1.default.find({ user: userId });
    console.log(dateValues, 'dateValues');
    res.status(200).json({ message: 'tem valores' });
});
app.get('/getRows', async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();
    const getPrinciple = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Bancos!AZ3:BB",
        valueRenderOption: "UNFORMATTED_VALUE"
    });
    const getETFs = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Bancos!AR2:AT",
        valueRenderOption: "UNFORMATTED_VALUE"
    });
    const getREITs = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Bancos!AJ2:AL",
        valueRenderOption: "UNFORMATTED_VALUE"
    });
    const getSTOCKs = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Bancos!AN2:AP",
        valueRenderOption: "UNFORMATTED_VALUE"
    });
    const getMOEDAs = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Bancos!S2:U",
        valueRenderOption: "UNFORMATTED_VALUE"
    });
    const getIndices = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Bancos!Y2:AA",
        valueRenderOption: "UNFORMATTED_VALUE"
    });
    const getFutures = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Bancos!AE2:AG",
        valueRenderOption: "UNFORMATTED_VALUE"
    });
    const data = {
        Principle: getPrinciple.data.values,
        ETFs: getETFs.data.values,
        REITs: getREITs.data.values,
        Stocks: getSTOCKs.data.values,
        Moedas: getMOEDAs.data.values,
        Indices: getIndices.data.values,
        Futures: getFutures.data.values
    };
    res.status(200).json({ data });
});
//API ALPHA
app.get('/alpha', async (req, res) => {
    const token = process.env.TOKEN_API;
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=petr&apikey=${token}`;
    const response = await axios_1.default.get(url, {
        headers: { 'User-Agent': 'request' }
    });
    if (!response.data) {
        console.log('Error:', response.data);
    }
    else {
        // data is successfully parsed as a JSON object:
        console.log(response.data);
    }
    console.log(response);
    res.send(200).json({ response });
});
app.post('/calcamount', CheckToken_1.default, CalcAmount_1.CalcAmount);
//Calc Aposent Tax and future expectation
app.post('/aposent', CheckToken_1.default, CreateAposent_1.CreateAposent);
app.get('/aposent', CheckToken_1.default, async (req, res) => {
    const started = new Date();
    const { userId } = req;
    // console.log(userId, 'idUser')
    const response = await ProjectLife_1.default.find({ user: userId });
    const ResChart = await ChartsTime_1.default.find({ user: userId });
    // const ResChart = chartRes
    const end = new Date();
    console.log(`Took ${end - started}ms aposent`);
    return res.json({ response, ResChart });
});
app.put('/aposent/:id', CheckToken_1.default, async (req, res) => {
    const started = new Date();
    const { id } = req.params;
    const { yearsOldNow, retirement, applyMonth, patrimonyInit, yearsConstruct, lifeExpect, retirementeValue, projectedINSS, otherSources, taxYear, taxMonth } = req.body;
    // console.log(yearsOldNow,retirement, applyMonth, patrimonyInit, yearsConstruct, lifeExpect,retirementeValue, projectedINSS , otherSources, taxYear,taxMonth, 'req.body')
    const { userId } = req;
    //  console.log(userId, 'user')
    //  console.log(id, 'id')
    var yearOld = Number(yearsOldNow);
    const patrimonyFormated = patrimonyInit.replaceAll('.', '');
    var montante = Number(patrimonyFormated.replace(',', '.')); // Valor Acumulado Atualmente
    var montanteInit = montante;
    const applyMonthFormated = applyMonth.replaceAll('.', '');
    var ValueMonth = Number(applyMonthFormated.replace(',', '.')); //55.76 //Valor de aporte por mes
    var taxNumber = Number(taxYear);
    //const taxMonthFormated = taxMonth.replaceAll('.', '')
    var taxaM = taxMonth; //Number(taxMonthFormated.replace(',', '.')) //0.95 // Taxa por mês
    const projectedINSSFormated = projectedINSS.replaceAll('.', '');
    var INSSproject = Number(projectedINSSFormated.replace(',', '.'));
    const otherSourcesFormated = otherSources.replaceAll('.', '');
    var otherSourcesFinal = Number(otherSourcesFormated.replace(',', '.'));
    const timeWork = yearsConstruct;
    var tempoM = timeWork * 12; // Meses de Criação de patrimonio
    var adicionado = 0;
    var ValueApos = 0;
    var ExpectLife = Number(lifeExpect);
    var RetireValueForm = retirementeValue.replaceAll('.', '');
    var RetireValue = Number(RetireValueForm.replace(',', '.'));
    var descontandoValue = Math.abs(RetireValue - INSSproject - otherSourcesFinal); //Valor a ser descontado para objetivo de aposentadoria
    var tempoApose = (ExpectLife - retirement) * 12; // meses de aposentadoria 65-90 anos 
    var totalAmountInit = Number(((tempoM * ValueMonth) + montante).toFixed(2));
    var idReturnUp = 0;
    var changeOfContribution = 0;
    var financialApplications = 0;
    var financialExists = 0;
    var idade = 0;
    var idadeMilion = 0;
    var tenYears = 0;
    var spreadsheet = [];
    var chartsTime = [];
    var chartsRetiment = [];
    function Montante(montante, taxaM, tempoM) {
        montante = (montante + (montante * (taxaM / 100))); //  * (1 + (taxaM / 100)) ** tempoM
        var txa = taxaM / 100;
        montante = Number(montante.toFixed(2));
        return montante;
    }
    for (var i = 0; i <= tempoM; i++) {
        if (i === idReturnUp) {
            if (changeOfContribution > 0) {
                ValueMonth = changeOfContribution;
            }
            if (financialApplications > 0) {
                montante = montante + financialApplications;
            }
            if (financialExists > 0) {
                montante = montante - financialExists;
            }
        }
        montante = Montante(montante, taxaM, tempoM);
        montante = montante + ValueMonth;
        idade = Number(((i / 12) + yearOld).toFixed(2));
        //  console.log(idade, 'recem')
        if (tenYears === 0) {
            if (i === 132) {
                tenYears = montante;
            }
        }
        if (idadeMilion === 0) {
            if (montante >= 1000000) {
                idadeMilion = Number(idade);
            }
        }
        if (Number.isInteger(idade) && idade === 20 || idade === 26 || idade === 33 || idade === 40 || idade === 47 || idade === 54 || idade === 61 || idade === 68 || idade === 75 || idade === 82 || idade === 90) {
            chartsTime.push({
                idade,
                montante
            });
        }
        // console.log( i, idade.toFixed(2) , montante, "Juros compostos com acumulado")
        spreadsheet.push({
            id: i,
            ValueMonth,
            montante,
            idade
        });
    }
    //console.log(spreadsheet, 'preenchido')
    var amountRetire = montante;
    var gainAmountInit = amountRetire - totalAmountInit;
    for (var i = 0; i <= tempoApose; i++) {
        montante = montante - descontandoValue;
        montante = Montante(montante, taxaM, tempoM);
        var idade = (i / 12) + 65;
        if (idade == 65.00) {
            // console.log(idade)
            ValueApos = montante;
        }
        if (Number.isInteger(idade) && idade === 20 || idade === 26 || idade === 33 || idade === 40 || idade === 47 || idade === 54 || idade === 61 || idade === 68 || idade === 75 || idade === 82 || idade === 90) {
            // console.log(idade, 'idade no if -')
            // console.log(montante, 'montante no if -')
            chartsTime.push({
                idade,
                montante
            });
        }
        //  console.log( idade.toFixed(2), montante, "Descontando Aposentadoria")
        spreadsheet.push({
            id: i,
            ValueMonth,
            montante,
            idade
        });
    }
    const tax = taxaM / 100;
    const valuetotal = RetireValue / tax;
    // console.log(valuetotal)
    // console.log(tax, 'tax')
    const resultCalc = tax / (1 - (1 / ((1 + tax) ** tempoM)));
    // console.log(resultCalc, 'Correct tax')
    const correctTop = valuetotal * resultCalc;
    const PortionMin = Number((correctTop - RetireValue).toFixed(2));
    // console.log(PortionMin, 'Parcela')
    const PortionNegative = Number((PortionMin - (PortionMin * 0.0804)).toFixed(2));
    // console.log(PortionNegative, 'parcela negativa')
    const PercentGainTenYears = (tenYears * 100) / (montanteInit === 0 ? 1 : montanteInit);
    // console.log(PercentGainTenYears, 'PercentGainTenYears')
    const PercentGainFees = (gainAmountInit * 100) / (montanteInit === 0 ? 1 : montanteInit);
    // console.log(PercentGainFees, 'PercentGainFees')
    const PercentGainRetirement = (ValueApos * 100) / (montanteInit === 0 ? 1 : montanteInit);
    // console.log(PercentGainRetirement, 'PercentGainRetirement')
    const PercentProjectPatrimony = (montante * 100) / (montanteInit === 0 ? 1 : montanteInit);
    // console.log(PercentProjectPatrimony, 'PercentProjectPatrimony')
    //console.log(spreadsheet, 'Com dedução da aposentadoria')
    // const dataSpread = {
    //   id: userId,
    //   spread: spreadsheet
    // }
    // const spreadRes = await SpreadSheet.findByIdAndUpdate(id, dataSpread, {new:true})
    // console.log(chartsTime, 'chartTime')
    const dataChart = {
        user: userId,
        chart: chartsTime
    };
    const dataRetirement = {
        user: userId,
        chartReti: chartsRetiment
    };
    const test = await ChartsTime_1.default.find({ id: userId });
    // console.log(test, 'teste 1 ')
    if (test.length > 0) {
        ///Corrigir o Updated
        // console.log(test[0]._id, test[0].id, dataChart, 'dataChart')
        await ChartsTime_1.default.findByIdAndUpdate(test[0].id, dataChart, { new: true });
        // console.log(dataRetirement, 'dataRetirement')
        // await ChartsTimeRetire.findByIdAndUpdate(id, dataRetirement, {new: true})
        // console.log("atualizou")
    }
    else {
        // console.log("cadastrou")
        await ChartsTime_1.default.create(dataChart);
        // await ChartsTimeRetire.create(dataRetirement)
    }
    // console.log(chartsTime, 'chartsTime')
    const data = {
        yearOld, retirement, ExpectLife, ValueMonth,
        montanteInit, RetireValue, tempoM, tempoApose,
        INSSproject, otherSourcesFinal, taxaM, taxNumber,
        montante, ValueApos, idadeMilion, totalAmountInit,
        gainAmountInit, tenYears, PortionMin, PortionNegative,
        PercentGainTenYears, PercentGainFees, PercentGainRetirement,
        PercentProjectPatrimony,
        user: userId
    };
    const Retirement = await ProjectLife_1.default.findByIdAndUpdate(id, data, { new: true });
    // console.log('idadeAtual',yearOld, 'idade aposentado', retirement, 'expectativa', ExpectLife, 'valor por mes', ValueMonth, 'Montante inicial', montanteInit, 'retirado na aposentadoria', RetireValue,'tempo de produçao',tempoM, 'tempo de aposentadoria',tempoApose, 'valor inss', INSSproject, 'outras fontes', otherSourcesFinal, 'taxa mensal', taxaM, 'taxa anual', taxNumber, 'montante final calculo', montante, 'montante no ano de aposentado', ValueApos , 'idade 1 milhão', idadeMilion, 'total guardado sem juros',  totalAmountInit,gainAmountInit, 'montante em 10 anos',tenYears, 'parcela Boa', PortionMin, 'Parcela ruim', PortionNegative, 'Salvar no banco' )  
    const end = new Date();
    console.log(`Took ${end - started}ms aposent updated`);
    return res.json({ montante, ValueApos, idadeMilion, totalAmountInit, gainAmountInit, tenYears, PortionMin, PortionNegative, chartsTime });
});
app.post('/savings', CheckToken_1.default, Savings_1.Savings);
app.get('/savings', CheckToken_1.default, async (req, res) => {
    const { userId } = req;
    // console.log(userId, 'id no savings get')
    const response = await SavingsModel_1.default.find({ user: userId });
    return res.status(200).json({ response });
});
app.delete('/savings/:id', CheckToken_1.default, async (req, res) => {
    const { id } = req.params;
    console.log(id, 'id delete');
    await DirectTreasureModel_1.default.findByIdAndDelete(id);
    return res.status(204).json({ message: 'Delete success' });
});
app.post('/direct-treasure', CheckToken_1.default, DirectTreasure_1.DirectTreasure);
app.get('/direct-treasure', CheckToken_1.default, async (req, res) => {
    const { userId } = req;
    // console.log(userId, 'id no direct-Treasure get')
    const data = dadosFixed_json_1.default.response.TrsrBdTradgList;
    const response = await DirectTreasureModel_1.default.find({ user: userId });
    // console.log(response, 'response do direct treasure')
    // console.log(data[0].TrsrBd.nm, 'data do tesouro ')
    const ValueSell = response.map(res => {
        for (var value = 0; value < data.length; value++) {
            if (res.codeName === data[value].TrsrBd.nm) {
                let dateCorrect = new Date(data[value].TrsrBd.mtrtyDt);
                let today = `${(dateCorrect.getDay() <= 9) ? '0' + dateCorrect.getDay() : dateCorrect.getDay()}/${(dateCorrect.getMonth() <= 9) ? '0' + dateCorrect.getMonth() : dateCorrect.getMonth()}/${dateCorrect.getFullYear()}`;
                let quantTrue = (res.amountNum * 100);
                let obj = {
                    _id: res._id,
                    buyValue2: res.buyValue2,
                    amount: res.amountNum,
                    dateBuy: res.dateBuy,
                    dateSell: today,
                    codeName: res.codeName,
                    user: res.user,
                    type: res.type,
                    __v: res.__v,
                    minRedQty: data[value].TrsrBd.minRedQty,
                    untrRedVal: data[value].TrsrBd.untrRedVal,
                    minRedVal: data[value].TrsrBd.minRedVal
                };
                return obj;
            }
        }
    });
    // console.log(ValueSell, 'value sell')
    return res.status(200).json({ response, ValueSell });
});
app.delete('/direct-treasure/:id', CheckToken_1.default, async (req, res) => {
    const { id } = req.params;
    // console.log(id, 'id delete')
    await DirectTreasureModel_1.default.findByIdAndDelete(id);
    return res.status(200);
});
app.post('/fixed-income', CheckToken_1.default, FixedIncomeFunction_1.FixedIncomeFunction);
app.get('/fixed-income', CheckToken_1.default, async (req, res) => {
    const { userId } = req;
    // console.log(userId, 'id no fixed-Income get')
    const response = await FixedIncome_1.default.find({ user: userId });
    return res.status(200).json({ response });
});
app.delete('/fixed-income/:id', CheckToken_1.default, async (req, res) => {
    const { id } = req.params;
    // console.log(id, 'id delete')
    await FixedIncome_1.default.findByIdAndDelete(id);
    return res.send();
});
app.get('/dadostesouro', async (req, res) => {
    const data = dadosFixed_json_1.default.response.TrsrBdTradgList;
    // console.log(data, 'dados do tesouro diretor no back')
    res.status(200).json({ data });
});
app.get('/dados-actives', async (req, res) => {
    const Codes = await axios_1.default.get(`https://brapi.dev/api/quote/list`);
    const stocks = Codes.data.stocks;
    res.status(200).json({ stocks });
});
// app.get('/testando/:bondName', async (req, res) => {
// //Teste doido
//   // let srcURL = "https://www.tesourodireto.com.br/json/br/com/b3/tesourodireto/service/api/treasurybondsinfo.json";
//   let jsondata =dadosFixedJson.toString() //await axios.get(srcURL) as string;
//   console.log(jsondata, 'jsonData')
//   let parsedData = JSON.parse(jsondata).response;
//   console.log(parsedData, 'parsedData')
//       console.log(parsedData, 'parsedData')
//       for(let bond of parsedData.TrsrBdTradgList) {
//           let currBondName = bond.TrsrBd.nm;
//           if (currBondName.toLowerCase() === bondName.toLowerCase())
//               if(argumento == "r")
//                   return bond.TrsrBd.untrRedVal;
//               else
//                   return bond.TrsrBd.untrInvstmtVal;
//       }
//       throw new Error("Título não encontrado.");
//   // console.log(response, 'json ')
//   return res.json({})
// /*
// * @return Retorna a cotação atual de um título específico do Tesouro Direto. 
// * Fonte: https://www.tesourodireto.com.br/titulos/precos-e-taxas.htm
// **/
// // async function TESOURODIRETO(bondName, argumento="r") {
// //   let srcURL = "https://www.tesourodireto.com.br/json/br/com/b3/tesourodireto/service/api/treasurybondsinfo.json";
// //   let jsondata = await axios.get(srcURL) as string;
// //   console.log(jsondata, 'jsonData')
// //   let parsedData = JSON.parse(jsondata).response;
// //   console.log(parsedData, 'parsedData')
// //   for(let bond of parsedData.TrsrBdTradgList) {
// //       let currBondName = bond.TrsrBd.nm;
// //       if (currBondName.toLowerCase() === bondName.toLowerCase())
// //           if(argumento == "r")
// //               return bond.TrsrBd.untrRedVal;
// //           else
// //               return bond.TrsrBd.untrInvstmtVal;
// //   }
// //   throw new Error("Título não encontrado.");
// // }
// // TESOURODIRETO()
// })
//CRUD ACTIVES B3
app.post('/stocks', CheckToken_1.default, async (req, res) => {
    const { userId } = req;
    const { buyValue, amountBuy, dateBuy, codeName, category, type } = req.body;
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();
    const getSTOCKs = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Bancos!AN2:AP",
        valueRenderOption: "UNFORMATTED_VALUE"
    });
    let stockData = {};
    const dataStock = getSTOCKs.data.values.filter(sto => {
        if (codeName === sto[0]) {
            stockData = sto;
            return stockData;
        }
    });
    const stock = {
        buyValue,
        amountBuy,
        dateBuy,
        codeName,
        category,
        type,
        priceWhenBuy: stockData[1],
        percentWhenBuy: stockData[2],
        user: userId
    };
    const response = await StocksModel_1.default.create(stock);
    res.json({ response });
});
app.get('/stocks', CheckToken_1.default, async (req, res) => {
    const { userId } = req;
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();
    const getSTOCKs = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Bancos!AN2:AP",
        valueRenderOption: "UNFORMATTED_VALUE"
    });
    const response = await StocksModel_1.default.find({ user: userId });
    let stockData = [];
    const dataStock = getSTOCKs.data.values.filter(sto => {
        for (var tok = 0; tok < response.length; tok++) {
            if (response[tok].codeName === sto[0]) {
                stockData.push(sto);
            }
        }
    });
    const FinallyStock = response.map(stocked => {
        let stock = {};
        for (var active = 0; active < stockData.length; active++) {
            if (stocked.codeName === stockData[active][0]) {
                let totalInvest = stocked.buyValue * stocked.amountBuy;
                let totalInvestNow = stocked.amountBuy * stockData[active][1];
                let totalPercent = ((stockData[active][1] * 100) / stocked.buyValue) - 100;
                let media = 1;
                stock = {
                    id: stocked._id,
                    buyValue: stocked.buyValue,
                    amountBuy: stocked.amountBuy,
                    totalInvest,
                    dateBuy: stocked.dateBuy,
                    codeName: stocked.codeName,
                    category: stocked.category,
                    type: stocked.type,
                    priceWhenBuy: stocked.priceWhenBuy,
                    percentWhenBuy: stocked.percentWhenBuy,
                    valueNow: stockData[active][1],
                    percentNow: stockData[active][2],
                    totalInvestNow,
                    totalPercent,
                    media,
                    user: userId
                };
            }
        }
        return stock;
    });
    console.log(FinallyStock, 'data do finally stock');
    let respo = [];
    let inserir = true;
    for (var dat = 0; dat < FinallyStock.length; dat++) {
        for (var de = 0; de < respo.length; de++) {
            if (respo[de].codeName === FinallyStock[dat].codeName) {
                inserir = false;
                if (respo[de].type == 'Compra') {
                    console.log(respo[de].buyValue, FinallyStock[dat].buyValue, 'valores de compra aqui ');
                    respo[de].buyValue = ((respo[de].buyValue + FinallyStock[dat].buyValue));
                    respo[de].amountBuy = (respo[de].amountBuy + FinallyStock[dat].amountBuy);
                    respo[de].media = respo[de].media + 1;
                }
                else if (FinallyStock[dat].amountBuy > respo[de].amountBuy) {
                    respo[de].buyValue = Math.abs(FinallyStock[dat].buyValue);
                    respo[de].amountBuy = Math.abs(respo[de].amountBuy - FinallyStock[dat].amountBuy);
                    respo[de].media = 1;
                    respo[de].type = FinallyStock[dat].type;
                }
                else {
                    respo[de].buyValue = Math.abs(respo[de].buyValue - FinallyStock[dat].buyValue);
                    respo[de].amountBuy = Math.abs(respo[de].amountBuy - FinallyStock[dat].amountBuy);
                    respo[de].media = 1;
                    respo[de].type = FinallyStock[dat].type;
                }
            }
            else {
                inserir = true;
            }
        }
        if (inserir) {
            respo.push(FinallyStock[dat]);
        }
    }
    const data = respo.map(stock => {
        if (stock.amountBuy !== 0) {
            var amountTickerTrue = 0;
            var downUp = false;
            if (stock.category === 'Venda') {
                amountTickerTrue = Number(((stock.buyValue - stock.valueNow) * stock.amountBuy));
                downUp = false;
            }
            else {
                amountTickerTrue = ((stock.valueNow - stock.amountBuy) * stock.amountBuy) + (stock.buyValue * stock.amountBuy);
            }
            let media = 0;
            console.log(stock.media);
            if (stock.media == 0) {
                media = 1;
            }
            else {
                media = stock.media;
            }
            let Media = (stock.buyValue / media);
            let totalInvest = (Media * stock.amountBuy);
            let totalInvestNow = stock.valueNow * stock.amountBuy;
            let totalPercent = ((stock.valueNow * 100) / Media) - 100;
            return {
                id: stock.id,
                buyValue: Media,
                amountBuy: stock.amountBuy,
                totalInvest,
                dateBuy: stock.dateBuy,
                codeName: stock.codeName,
                category: stock.category,
                type: stock.type,
                priceWhenBuy: stock.priceWhenBuy,
                percentWhenBuy: stock.percentWhenBuy,
                valueNow: stock.valueNow,
                percentNow: stock.percentNow,
                totalInvestNow,
                totalPercent,
                media: stock.media,
                user: stock.user
            };
        }
        else {
            return;
        }
    });
    // console.log(data, 'data finalizado')
    res.json({ FinallyStock, data });
});
app.post('/active', CheckToken_1.default, async (req, res) => {
    const { buyValue, amountBuy, dateBuy, codeName, category } = req.body;
    // console.log(buyValue, amountBuy, dateBuy, codeName, category, 'category aqui')
    const { userId } = req;
    const ticker = await axios_1.default.get(`https://brapi.dev/api/quote/${codeName}`);
    const valueNow = ticker.data.results[0].regularMarketPrice;
    const format = buyValue.replaceAll('.', '');
    const formatedBuyValue = format.replace(',', '.');
    const valueTotalBuy = Number(amountBuy) * Number(formatedBuyValue);
    const valueTotalBuyNow = Number(amountBuy) * valueNow;
    const valueNumber = Number(formatedBuyValue);
    const ActiveBody = {
        user: userId,
        buyValue: valueNumber,
        dateBuy,
        amountBuy,
        codeName,
        valueNow,
        category
    };
    //console.log(ActiveBody, 'body buy new')
    const Active = await Actives_1.default.create(ActiveBody);
    return res.json({ Active });
});
app.get('/active', CheckToken_1.default, async (req, res) => {
    const { userId } = req;
    // console.log(userId, 'userId')
    const response = await Actives_1.default.find({ user: userId });
    // console.log(response, 'response do getActive')
    const TickersAll = await axios_1.default.get(`https://brapi.dev/api/quote/list`);
    const tickers = response.map((ticker) => {
        return ticker.codeName.toLocaleUpperCase();
    });
    // console.log(tickers[0], tickers.length-1, 'tickers name')
    // console.log(TickersAll.data.stocks, 'tickersAll')
    var stockUpList = TickersAll.data.stocks.filter(stock => {
        // console.log(stock, 'stock dentro')
        for (var array = 0; array < tickers.length; array++) {
            //  console.log(tickers[array], 'teste')
            //  console.log(stock.stock, 'stock.stock')
            if (tickers[array] == stock.stock) {
                // console.log(stock.stock, tickers[array], 'stock dentro')
                return stock;
            }
        }
    });
    // console.log(stockUpList, 'stockList')
    const UpdatedStock = response.map(ticker => {
        var UpDown = false;
        var amountTicker = 0;
        var amountInit = 0;
        var currentVariation = 0;
        var totalVariation = 0;
        var percentTotalVariation = 0;
        var valueNow = 0;
        var logo = '';
        var percent = '';
        var sector = '';
        var category = '';
        var media = 0;
        const valueFinally = stockUpList.filter(stock => {
            // console.log(stock.stock, ticker.codeName.toLocaleUpperCase() , 'teste dentro do filter')
            if (stock.stock === ticker.codeName.toLocaleUpperCase()) {
                return stock;
            }
        });
        if (valueFinally.length > 0) {
            if (valueFinally[0].change && valueFinally[0].change > 0) {
                UpDown = true;
            }
            else {
                UpDown = false;
            }
            amountInit = ticker.buyValue * ticker.amountBuy;
            amountTicker = Number((valueFinally[0].close * ticker.amountBuy).toFixed(2));
            // console.log(valueFinally[0], 'value finally [0]')
            if (valueFinally[0].change > 0) {
                currentVariation = Number(((amountTicker * (Math.abs(valueFinally[0].change))) / 100 + (Math.abs(valueFinally[0].change))).toFixed(2));
            }
            else {
                currentVariation = -Number(((amountTicker * (Math.abs(valueFinally[0].change))) / 100 + (Math.abs(valueFinally[0].change))).toFixed(2));
            }
            if (amountInit > amountTicker) {
                totalVariation = Number((amountTicker - amountInit).toFixed(2));
                percentTotalVariation = -Number(((totalVariation * 100) / amountInit).toFixed(2));
            }
            else if (amountInit < amountTicker) {
                totalVariation = Number((amountTicker - amountInit).toFixed(2));
                percentTotalVariation = Number(((totalVariation * 100) / amountInit).toFixed(2));
            }
            valueNow = Number((valueFinally[0].close).toFixed(2));
            logo = valueFinally[0].logo;
            percent = valueFinally[0].change;
            sector = valueFinally[0].sector;
            // category = valueFinally[0].category
        }
        const Ticker = {
            id: ticker.id,
            logo,
            codeName: ticker.codeName.toLocaleUpperCase(),
            buyValue: ticker.buyValue,
            valueNow,
            buyQuant: ticker.amountBuy,
            UpDown,
            percent,
            currentVariation,
            amountInit,
            amountTicker,
            totalVariation,
            percentTotalVariation,
            sector,
            category: ticker.category,
            media
        };
        return Ticker;
    });
    //  console.log(UpdatedStock, 'UpdatedStock')
    let newStocks = [];
    let inserir = true;
    for (var am = 0; am < UpdatedStock.length; am++) {
        ///Teste run 
        for (var de = 0; de < newStocks.length; de++) {
            if (newStocks[de].codeName === UpdatedStock[am].codeName) {
                inserir = false;
                if (UpdatedStock[am].category == 'Compra') {
                    newStocks[de].buyValue = ((newStocks[de].buyValue + UpdatedStock[am].buyValue));
                    newStocks[de].buyQuant = (newStocks[de].buyQuant + UpdatedStock[am].buyQuant);
                    newStocks[de].media = am + 1;
                }
                else if (UpdatedStock[am].buyQuant > newStocks[de].buyQuant) {
                    newStocks[de].buyValue = Math.abs(UpdatedStock[am].buyValue);
                    newStocks[de].buyQuant = Math.abs(newStocks[de].buyQuant - UpdatedStock[am].buyQuant);
                    newStocks[de].media = 1;
                    newStocks[de].category = UpdatedStock[am].category;
                }
                else {
                    newStocks[de].buyValue = Math.abs(newStocks[de].buyValue - UpdatedStock[am].buyValue);
                    newStocks[de].buyQuant = Math.abs(newStocks[de].buyQuant - UpdatedStock[am].buyQuant);
                    newStocks[de].media = 1;
                    newStocks[de].category = UpdatedStock[am].category;
                }
            }
            else {
                inserir = true;
            }
        }
        if (inserir) {
            newStocks.push(UpdatedStock[am]);
        }
    }
    // console.log(newStocks, 'new stocks')
    const data = newStocks.map(stock => {
        if (stock.buyQuant !== 0) {
            var amountTickerTrue = 0;
            var downUp = false;
            if (stock.category === 'Venda') {
                amountTickerTrue = Number(((stock.buyValue - stock.valueNow) * stock.buyQuant));
                downUp = false;
            }
            else {
                amountTickerTrue = ((stock.valueNow - stock.buyValue) * stock.buyQuant) + (stock.buyValue * stock.buyQuant);
            }
            let media = 0;
            if (stock.media == 0) {
                media = 1;
            }
            else {
                media = stock.media;
            }
            return {
                id: stock.id,
                logo: stock.logo,
                percent: stock.percent,
                codeName: stock.codeName,
                buyValue: (stock.buyValue / media),
                valueNow: stock.valueNow,
                buyQuant: stock.buyQuant,
                UpDown: downUp,
                currentVariation: stock.currentVariation,
                amountInit: (stock.buyValue * stock.buyQuant),
                amountTicker: (amountTickerTrue),
                totalVariation: stock.totalVariation,
                percentTotalVariation: stock.percentTotalVariation,
                sector: stock.sector,
                category: stock.category
            };
        }
        else {
            return;
        }
    });
    let valueReduce = 0;
    const totalVariableIncome = data.reduce((acc, stock) => acc + stock.amountTicker, valueReduce);
    return res.json({ UpdatedStock, data, totalVariableIncome });
});
app.delete('/deleteactive/:id', CheckToken_1.default, async (req, res) => {
    const { id } = req.params;
    await Actives_1.default.findByIdAndDelete(id);
    return res.send();
});
app.get('/sticker', async (req, res) => {
    const TickersAll = await axios_1.default.get(`https://brapi.dev/api/quote/list`);
    const vale3 = TickersAll.data.stocks.filter(stock => {
        if (stock.stock === 'VALE3') {
            return stock;
        }
    });
    const petr4 = TickersAll.data.stocks.filter(stock => {
        if (stock.stock === 'PETR4') {
            return stock;
        }
    });
    const itub3 = TickersAll.data.stocks.filter(stock => {
        if (stock.stock === 'ITUB3') {
            return stock;
        }
    });
    const bbdc4 = TickersAll.data.stocks.filter(stock => {
        if (stock.stock === 'BBDC4') {
            return stock;
        }
    });
    const abev3 = TickersAll.data.stocks.filter(stock => {
        if (stock.stock === 'ABEV3') {
            return stock;
        }
    });
    const stocksTops = [
        vale3, petr4, itub3, bbdc4, abev3
    ];
    return res.json({ stocksTops });
});
//CRUD TAX PLANNING INIT
app.post('/taxplanning', CheckToken_1.default, TaxCalculate_1.default, async (req, res) => {
    const { userId, annualIncomeCorrect, healthCorrect, dependentsCorrect, spendingOnEducation, Alimony, ContributionPGBL, INSS, withholdingTax, FirstAliquot, SecondAliquot, ThirdAliquot, FourAliquot, FiveAliquot, taxTotal, BalanceRefounded, NewTaxBase, taxFirst, taxSecond, TaxThirdRate, TaxFourRate, TaxFiveRate, EducationCalc, PGBLCalc, dependentsCalc, TotalDedution, CorrectAliquot, AliquoteEffect } = req;
    // console.log(BalanceRefounded, 'post')
    // console.log(FirstAliquot, SecondAliquot, ThirdAliquot, FourAliquot, FiveAliquot,taxTotal, BalanceRefounded ,taxFirst, taxSecond ,NewTaxBase,EducationCalc,PGBLCalc,dependentsCalc, 'na rota')
    const taxPlanning = {
        user: userId,
        annualIncomeCorrect,
        healthCorrect,
        dependentsCorrect,
        spendingOnEducation,
        Alimony,
        ContributionPGBL,
        INSS,
        withholdingTax,
        FirstAliquot, SecondAliquot, ThirdAliquot, FourAliquot, FiveAliquot,
        taxTotal, BalanceRefounded, NewTaxBase, taxFirst, taxSecond, TaxThirdRate, TaxFourRate, TaxFiveRate,
        EducationCalc, PGBLCalc, dependentsCalc, TotalDedution, CorrectAliquot, AliquoteEffect
    };
    // console.log(taxPlanning, 'verificar ')
    const TaxPlanCreateResponse = await TaxModel_1.default.create(taxPlanning);
    return res.json({ TaxPlanCreateResponse });
});
app.get('/gettaxplans', CheckToken_1.default, async (req, res) => {
    const { userId } = req;
    const response = await TaxModel_1.default.find({ user: userId });
    res.json({ response });
});
app.put('/taxplanning/:id', CheckToken_1.default, TaxCalculate_1.default, async (req, res) => {
    const { id } = req.params;
    const { userId, annualIncomeCorrect, healthCorrect, dependentsCorrect, Alimony, spendingOnEducation, ContributionPGBL, INSS, withholdingTax, FirstAliquot, SecondAliquot, ThirdAliquot, FourAliquot, FiveAliquot, taxTotal, BalanceRefounded, PercentBalanceRefounded, NewTaxBase, taxFirst, taxSecond, TaxThirdRate, TaxFourRate, TaxFiveRate, EducationCalc, PGBLCalc, dependentsCalc, TotalDedution, CorrectAliquot, AliquoteEffect } = req;
    // console.log(BalanceRefounded, 'up')
    //  console.log(FirstAliquot, SecondAliquot, ThirdAliquot, FourAliquot, FiveAliquot,taxTotal, taxFirst, taxSecond ,NewTaxBase,EducationCalc,PGBLCalc,dependentsCalc, TotalDedution, 'na rota')
    const taxPlanning = {
        user: userId,
        annualIncomeCorrect,
        healthCorrect,
        dependentsCorrect,
        spendingOnEducation,
        Alimony,
        ContributionPGBL,
        INSS,
        withholdingTax,
        FirstAliquot, SecondAliquot, ThirdAliquot, FourAliquot, FiveAliquot,
        taxTotal, BalanceRefounded, PercentBalanceRefounded, NewTaxBase, taxFirst, taxSecond, TaxThirdRate, TaxFourRate, TaxFiveRate,
        EducationCalc, PGBLCalc, dependentsCalc, TotalDedution, CorrectAliquot, AliquoteEffect
    };
    const response = await TaxModel_1.default.findByIdAndUpdate(id, taxPlanning, { new: true });
    // console.log(response, 'up')
    res.json({ response });
});
app.get('/calc', async (req, res) => {
    let fruits = [
        { description: 'orange', Amount: 50 },
        { description: 'orange', Amount: 50 },
        { description: 'apple', Amount: 75 },
        { description: 'kiwi', Amount: 35 },
        { description: 'kiwi', Amount: 40 },
        { description: 'watermelon', Amount: 25 },
    ];
    let newfruits = [];
    let inserir = true;
    for (var fr = 0; fr < fruits.length; fr++) {
        let Amount = 0;
        for (var fr2 = 0; fr2 < newfruits.length; fr2++) {
            if (newfruits[fr2].description === fruits[fr].description) {
                newfruits[fr2].Amount += fruits[fr].Amount;
                inserir = false;
            }
            else {
                inserir = true;
            }
        }
        if (inserir) {
            newfruits.push(fruits[fr]);
        }
    }
    res.status(200).json({ message: 'Ok' });
});
//FINANCIAL MANAGEMENT CRUD INIT
app.get('/statement', CheckToken_1.default, TotalCalculator_1.default, Statement_1.default);
//Deposit 
app.post('/deposit', CheckToken_1.default, TotalCalculator_1.default, Deposit_1.default);
//List Customer
app.put('/updated/:id', CheckToken_1.default, UpdatedWallet_1.default);
// Delete 
app.delete('/delete/:id', CheckToken_1.default, TotalCalculator_1.default, DeleteWallet_1.default);
//BalanceShet CRUD INIT
app.post('/createBalance', CheckToken_1.default, CreateBalance_1.default);
app.get('/viewbalance', CheckToken_1.default, PatrimonyCalculate_1.default, ViewBalance_1.default);
app.delete('/deletebalance/:id', CheckToken_1.default, TotalCalculator_1.default, DeleteBalance_1.default);
//CRUD USER
//Route Register User 
app.post('/auth/register', RegisterUser_1.default);
//Login User
app.post('/auth/user', TotalCalculator_1.default, GreetTime_1.GreetTime, LoginUser_1.default);
//RESET PASSWORD CRUD
// Recover Password
app.post('/recover', RecoverPassword_1.default);
//Reset Get
app.get('/reset-password/:id/:token', ResetPassword_1.default);
//Reset Create
app.post('/reset-password/:id/:token', ResetPass_1.default);
//credential google
async function getAuthSheets() {
    const auth = new googleapis_1.google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });
    const client = await auth.getClient();
    const googleSheets = googleapis_1.google.sheets({
        version: 'v4',
        auth: client
    });
    const spreadsheetId = "1XFfFn-bvLbgF1xTWffhVeXnVGWiRkmeEFst1T0A3Jq8";
    return {
        auth,
        client,
        googleSheets,
        spreadsheetId
    };
}
// db credentials
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
console.log('1', dbUser, dbPass);
mongoose_1.default.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.s1s1pe2.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
    app.listen(port);
    console.log(`Success Conected database on ${port}`);
}).catch((err) => {
    console.log('2', dbUser, dbPass);
    console.log('Erro especificado a baixo');
    console.log(err);
});
