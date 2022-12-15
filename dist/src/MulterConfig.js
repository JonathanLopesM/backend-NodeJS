"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileFilter = exports.limits = exports.storage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
exports.storage = multer_1.default.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path_1.default.resolve("uploads"));
    },
    filename: (req, file, callback) => {
        const time = new Date().getTime();
        const id = req.params;
        callback(null, `${time}_${file.originalname}`);
    },
});
exports.limits = {
    fileSize: 2 * 1024 * 1024
};
const fileFilter = (re, file, callback) => {
    const allowedMines = [
        'file/pdf'
    ];
};
exports.fileFilter = fileFilter;
