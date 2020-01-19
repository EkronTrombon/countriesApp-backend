"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    saveUserImg(file, userId) {
        return new Promise((resolve, reject) => {
            // Create directory
            const path = this.createUserImgFile(userId);
            // File name
            const fileName = this.createCodedFileName(file.name);
            // Check if user image already exists
            const userImgExists = this.deleteExistingUserImg(userId);
            file.mv(`${path}/${fileName}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    saveTempImg(file, userId) {
        return new Promise((resolve, reject) => {
            // Create files
            const path = this.createUserFile(userId);
            // File name
            const fileName = this.createCodedFileName(file.name);
            // Move file from Temp to directory
            file.mv(`${path}/${fileName}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    createUserImgFile(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads/', userId);
        const pathUserImg = pathUser + '/img';
        const exists = fs_1.default.existsSync(pathUser);
        const existsUserImg = fs_1.default.existsSync(pathUserImg);
        if (!exists) {
            fs_1.default.mkdirSync(pathUser);
            // fs.mkdirSync(pathUserImg);
        }
        if (!existsUserImg) {
            fs_1.default.mkdirSync(pathUserImg);
        }
        return pathUserImg;
    }
    createUserFile(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';
        const exists = fs_1.default.existsSync(pathUser);
        const existsTemp = fs_1.default.existsSync(pathUserTemp);
        if (!exists) {
            fs_1.default.mkdirSync(pathUser);
            // fs.mkdirSync(pathUserTemp);
        }
        if (!existsTemp) {
            // fs.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    createCodedFileName(fileName) {
        const nameArray = fileName.split('.');
        const ext = nameArray[nameArray.length - 1];
        const codedId = uniqid_1.default();
        return `${codedId}.${ext}`;
    }
    moveImgsFromTempToPosts(userId) {
        const pathtemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathPost = path_1.default.resolve(__dirname, '../uploads/', userId, 'posts');
        if (!fs_1.default.existsSync(pathtemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPost)) {
            fs_1.default.mkdirSync(pathPost);
        }
        const imgsTemp = this.getImgsTemp(userId);
        imgsTemp.forEach(img => {
            fs_1.default.renameSync(`${pathtemp}/${img}`, `${pathPost}/${img}`);
        });
        return imgsTemp;
    }
    getImgsTemp(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    getImgUrl(userId, img) {
        const pathPost = path_1.default.resolve(__dirname, '../uploads/', userId, 'posts', img);
        const imgExists = fs_1.default.existsSync(pathPost);
        if (!imgExists) {
            return path_1.default.resolve(__dirname, '../assets/noImg.png');
        }
        return pathPost;
    }
    getUserImgUrl(userId, img) {
        const pathUserImg = path_1.default.resolve(__dirname, '../uploads/', userId, 'img', img);
        const imgExists = fs_1.default.existsSync(pathUserImg);
        if (!imgExists) {
            return path_1.default.resolve(__dirname, '../assets/noUser.png');
        }
        return pathUserImg;
    }
    getUserImgName(userId) {
        const pathUserImg = path_1.default.resolve(__dirname, '../uploads/', userId, 'img');
        if (!fs_1.default.existsSync(pathUserImg)) {
            return '';
        }
        return fs_1.default.readdirSync(pathUserImg)[0] || '';
    }
    deleteExistingUserImg(userId) {
        const pathUserImg = path_1.default.resolve(__dirname, '../uploads/', userId, 'img');
        if (!fs_1.default.existsSync(pathUserImg)) {
            return;
        }
        const userImg = fs_1.default.readdirSync(pathUserImg);
        if (fs_1.default.readdirSync(pathUserImg).length === 0) {
            return;
        }
        fs_1.default.unlinkSync(`${pathUserImg}/${userImg}`);
    }
}
exports.default = FileSystem;
