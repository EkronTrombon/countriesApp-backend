"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Token {
    constructor() { }
    static getJwtToken(payload) {
        return jsonwebtoken_1.default.sign({
            user: payload
        }, this.seed, { expiresIn: this.life });
    }
    static verifyToken(token) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, this.seed, (err, decoded) => {
                if (err) {
                    reject();
                }
                else {
                    resolve(decoded);
                }
            });
        });
    }
}
Token.seed = 'this_is_my_secret_seed_of_my_application';
Token.life = '30d'; // 30 days of life for my token
exports.default = Token;
