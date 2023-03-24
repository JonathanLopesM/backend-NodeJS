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
const CheckToken_1 = __importDefault(require("./middlewares/CheckToken"));
const LoginUser_1 = __importDefault(require("./controllers/LoginUser"));
const PrivateRoute_1 = __importDefault(require("./controllers/PrivateRoute"));
const RegisterUser_1 = __importDefault(require("./controllers/RegisterUser"));
const RecoverPassword_1 = __importDefault(require("./controllers/RecoverPassword"));
const ResetPass_1 = __importDefault(require("./controllers/ResetPass"));
const ResetPassword_1 = __importDefault(require("./controllers/ResetPassword"));
const TotalCalculator_1 = __importDefault(require("./middlewares/TotalCalculator"));
const PatrimonyCalculate_1 = __importDefault(require("./middlewares/PatrimonyCalculate"));
const GreetTime_1 = require("./middlewares/GreetTime");
const Statement_1 = __importDefault(require("./controllers/Statement"));
const Deposit_1 = __importDefault(require("./controllers/Deposit"));
const UpdatedWallet_1 = __importDefault(require("./controllers/UpdatedWallet"));
const DeleteWallet_1 = __importDefault(require("./controllers/DeleteWallet"));
const CreateBalance_1 = __importDefault(require("./controllers/CreateBalance"));
const ViewBalance_1 = __importDefault(require("./controllers/ViewBalance"));
const DeleteBalance_1 = __importDefault(require("./controllers/DeleteBalance"));
const TaxModel_1 = __importDefault(require("./models/TaxModel"));
const TaxCalculate_1 = __importDefault(require("./middlewares/TaxCalculate"));
const Actives_1 = __importDefault(require("./models/Actives"));
const ProjectLife_1 = __importDefault(require("./models/ProjectLife"));
const CalcAmount_1 = require("./controllers/CalcAmount");
const ChartsTime_1 = __importDefault(require("./models/ChartsTime"));
const CreateAposent_1 = require("./controllers/CreateAposent");
const upload = (0, multer_1.default)({ storage: MulterConfig_1.storage, limits: MulterConfig_1.limits });
const port = process.env.PORT || 3333;
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
app.get('/testando', async (req, res) => {
    //Teste doido
    let srcURL = "https://www.tesourodireto.com.br/json/br/com/b3/tesourodireto/service/api/treasurybondsinfo.json";
    let jsondata = await axios_1.default.get(srcURL);
    console.log(jsondata, 'jsonData');
    let parsedData = JSON.parse(jsondata).response;
    console.log(parsedData, 'parsedData');
    return res.json({});
    /*
    * @return Retorna a cotação atual de um título específico do Tesouro Direto.
    * Fonte: https://www.tesourodireto.com.br/titulos/precos-e-taxas.htm
    **/
    // async function TESOURODIRETO(bondName, argumento="r") {
    //   let srcURL = "https://www.tesourodireto.com.br/json/br/com/b3/tesourodireto/service/api/treasurybondsinfo.json";
    //   let jsondata = await axios.get(srcURL) as string;
    //   console.log(jsondata, 'jsonData')
    //   let parsedData = JSON.parse(jsondata).response;
    //   console.log(parsedData, 'parsedData')
    //   for(let bond of parsedData.TrsrBdTradgList) {
    //       let currBondName = bond.TrsrBd.nm;
    //       if (currBondName.toLowerCase() === bondName.toLowerCase())
    //           if(argumento == "r")
    //               return bond.TrsrBd.untrRedVal;
    //           else
    //               return bond.TrsrBd.untrInvstmtVal;
    //   }
    //   throw new Error("Título não encontrado.");
    // }
    // TESOURODIRETO()
});
//CRUD ACTIVES B3
app.post('/active', async (req, res) => {
    const { buyValue, quantBuy, dateBuy, name, codeName, dateform, type } = req.body;
    const { userId } = req;
    const ticker = await axios_1.default.get(`https://brapi.dev/api/quote/${codeName}`);
    const valueNow = ticker.data.results[0].regularMarketPrice;
    const format = buyValue.replaceAll('.', '');
    const formatedBuyValue = format.replace(',', '.');
    const valueTotalBuy = Number(quantBuy) * Number(formatedBuyValue);
    const valueTotalBuyNow = Number(quantBuy) * valueNow;
    const valueNumber = Number(formatedBuyValue);
    const ActiveBody = {
        user: userId,
        buyValue: valueNumber,
        dateBuy,
        quantBuy,
        name,
        codeName,
        dateform, type,
        valueNow
    };
    // console.log(ActiveBody, 'body')
    const Active = await Actives_1.default.create(ActiveBody);
    return res.json({ Active });
});
app.get('/active', CheckToken_1.default, async (req, res) => {
    const { userId } = req;
    const response = await Actives_1.default.find({ user: userId });
    const TickersAll = await axios_1.default.get(`https://brapi.dev/api/quote/list`);
    var CodeName = [];
    const tickers = response.map((ticker) => {
        return ticker.codeName.toLocaleUpperCase();
    });
    // console.log(tickers, 'tickers name')
    app.delete('/deleteactive/:id', CheckToken_1.default, async (req, res) => {
        const { id } = req.params;
        await Actives_1.default.findByIdAndDelete(id);
        return res.send();
    });
    const stockUpList = TickersAll.data.stocks.filter(stock => {
        for (var i = 0; i <= tickers.length; i++) {
            if (stock.stock === tickers[i]) {
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
        const valueFinally = stockUpList.filter(stock => {
            if (stock.stock === ticker.codeName.toLocaleUpperCase()) {
                return stock;
            }
        });
        if (valueFinally[0].change && valueFinally[0].change > 0) {
            UpDown = true;
        }
        else {
            UpDown = false;
        }
        amountInit = ticker.buyValue * ticker.quantBuy;
        amountTicker = Number((valueFinally[0].close * ticker.quantBuy).toFixed(2));
        // console.log(valueFinally[0])
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
        const Ticker = {
            id: ticker.id,
            logo: valueFinally[0].logo,
            codeName: ticker.codeName.toLocaleUpperCase(),
            buyValue: ticker.buyValue,
            valueNow,
            buyQuant: ticker.quantBuy,
            UpDown,
            percent: valueFinally[0].change,
            currentVariation,
            amountInit,
            amountTicker,
            totalVariation,
            percentTotalVariation,
            sector: valueFinally[0].sector,
        };
        return Ticker;
    });
    return res.json({ UpdatedStock });
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
