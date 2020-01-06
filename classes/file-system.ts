import { FileUpload } from '../interfaces/file-upload';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem {

    constructor() {}

    saveUserImg(file: FileUpload, userId: string) {
        return new Promise((resolve, reject) => {
            // Create directory
            const path = this.createUserImgFile(userId);
            // File name
            const fileName = this.createCodedFileName(file.name);
            // Check if user image already exists
            const userImgExists = this.deleteExistingUserImg(userId);
            file.mv(`${path}/${fileName}`, (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    saveTempImg(file: FileUpload, userId: string) {
        return new Promise((resolve, reject) => {
            // Create files
            const path = this.createUserFile(userId);
            // File name
            const fileName = this.createCodedFileName(file.name);
            // Move file from Temp to directory
            file.mv(`${path}/${fileName}`, (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    private createUserImgFile(userId: string) {
        const pathUser = path.resolve(__dirname, '../uploads/', userId);
        const pathUserImg = pathUser + '/img';
        const exists = fs.existsSync(pathUser);
        const existsUserImg = fs.existsSync(pathUserImg);
        if (!exists) {
            fs.mkdirSync(pathUser);
            // fs.mkdirSync(pathUserImg);
        }
        if (!existsUserImg) {
            fs.mkdirSync(pathUserImg);
        }
        return pathUserImg;
    }

    private createUserFile(userId: string) {
        const pathUser = path.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';
        const exists = fs.existsSync(pathUser);
        if (!exists) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }

    private createCodedFileName(fileName: string) {
        const nameArray = fileName.split('.');
        const ext = nameArray[nameArray.length - 1];
        const codedId = uniqid();
        return `${codedId}.${ext}`;
    }

    moveImgsFromTempToPosts(userId: string) {
        const pathtemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathPost = path.resolve(__dirname, '../uploads/', userId, 'posts');
        if (!fs.existsSync(pathtemp)) {
            return [];
        }
        if (!fs.existsSync(pathPost)) {
            fs.mkdirSync(pathPost);
        }
        const imgsTemp = this.getImgsTemp(userId);
        imgsTemp.forEach(img => {
            fs.renameSync(`${pathtemp}/${img}`, `${pathPost}/${img}`);
        });
        return imgsTemp;
    }

    private getImgsTemp(userId: string) {
        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
        return fs.readdirSync(pathTemp) || [];
    }

    getImgUrl(userId: string, img: string) {
        const pathPost = path.resolve(__dirname, '../uploads/', userId, 'posts', img);
        const imgExists = fs.existsSync(pathPost);
        if (!imgExists) {
            return path.resolve(__dirname, '../assets/noImg.png');
        }
        return pathPost;
    }

    getUserImgUrl(userId: string, img: string) {
        const pathUserImg = path.resolve(__dirname, '../uploads/', userId, 'img', img);
        const imgExists = fs.existsSync(pathUserImg);
        if (!imgExists) {
            return path.resolve(__dirname, '../assets/noUser.png');
        }
        return pathUserImg;
    }

    getUserImgName(userId: string) {
        const pathUserImg = path.resolve(__dirname, '../uploads/', userId, 'img');
        if (!fs.existsSync(pathUserImg)) {
            return '';
        }
        return fs.readdirSync(pathUserImg)[0] || '';
    }

    private deleteExistingUserImg(userId: string) {
        const pathUserImg = path.resolve(__dirname, '../uploads/', userId, 'img');
        if (!fs.existsSync(pathUserImg)) {
            return;
        }
        const userImg = fs.readdirSync(pathUserImg);
        if (fs.readdirSync(pathUserImg).length === 0) {
            return;
        }
        fs.unlinkSync(`${pathUserImg}/${userImg}`);
    }
}