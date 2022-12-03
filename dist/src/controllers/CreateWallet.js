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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Wallet_1 = __importDefault(require("@models/Wallet"));
function CreateWallet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { value, description, category, date } = req.body;
        if (!value) {
            return res.status(422).json({ message: 'O nome é obrigatório' });
        }
        const walletExists = yield Wallet_1.default.findOne({ value: value });
        if (!walletExists) {
            const wallet = new Wallet_1.default({
                value,
                description,
                category,
                date
            });
            yield wallet.save();
        }
        try {
            res.status(201).json({ message: 'usuario criado com sucesso!' });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Erro no servidores' });
        }
    });
}
exports.default = CreateWallet;
