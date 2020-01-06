"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: [true, 'Name is required'] },
    lastName: { type: String, required: [true, 'Last Name is required'] },
    userName: { type: String, required: [true, 'User NickName is required'] },
    password: { type: String, required: [true, 'Password is required'] },
    country: { type: String, required: false },
    img: { type: String, default: '', required: [false] }
});
userSchema.method('comparePassword', function (pwd = '') {
    if (bcryptjs_1.default.compareSync(pwd, this.password)) {
        return true;
    }
    else {
        return false;
    }
});
;
exports.User = mongoose_1.model('User', userSchema);
