"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreetTime = void 0;
const GreetTime = (req, res, next) => {
    const Hello = new Date();
    const Hours = Hello.getHours();
    var greet = "";
    if (Hours >= 5 && Hours <= 12) {
        greet = "Bom Dia";
    }
    else if (Hours >= 13 && Hours <= 18) {
        greet = "Boa Tarde";
    }
    else {
        greet = "Boa Noite";
    }
    req.greet = greet;
    next();
};
exports.GreetTime = GreetTime;
