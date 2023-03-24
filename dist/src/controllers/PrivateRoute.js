"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const Amounts_1 = __importDefault(require("../models/Amounts"));
async function PrivateRoute(req, res) {
    const id = req.params.id;
    const { TotalFounds, TotalDebits, TotalCredits } = req;
    //check if user exists
    const user = await User_1.default.findById(id, '-password').populate(['statement']);
    console.log(user.populate('statement'));
    if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    const customers = await Amounts_1.default.find({ user: id });
    await Promise.all(customers.map(async (customer) => {
        const userCustomer = new Amounts_1.default({ ...customer, user: user._id });
        await userCustomer.save();
        user.statement.push(userCustomer);
    }));
    // console.log(userId)
    //  await user.statement.push(customers)
    res.status(200).json({ user, TotalFounds, TotalDebits, TotalCredits });
}
exports.default = PrivateRoute;
