"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const imgRoutes = express_1.Router();
imgRoutes.get('/:type/:img', (req, res) => {
    const type = req.params.type;
    const img = req.params.img;
    const pathUrl = path.resolve(__dirname, `../../uploads/${type}/${img}`);
    if (fs.existsSync(pathUrl)) {
        res.sendFile(pathUrl);
    }
    else {
        const noUserPath = path.resolve(__dirname, `../assets/noUser.png`);
        res.sendFile(noUserPath);
    }
});
exports.default = imgRoutes;
