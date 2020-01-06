"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class Server {
    constructor() {
        this.port = 3000;
        this.env = 'dev';
        this.urlDB = '';
        this.app = express_1.default();
        this.urlDB = 'mongodb://localhost:27017/countriesApp';
    }
    start(callback) {
        this.app.listen(this.port, callback);
    }
}
exports.default = Server;
