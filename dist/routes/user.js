"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../models/user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const token_1 = __importDefault(require("../classes/token"));
const auth_1 = require("../middlewares/auth");
const file_system_1 = __importDefault(require("../classes/file-system"));
const userRoutes = express_1.Router();
const fileSystem = new file_system_1.default();
// Get user Image
userRoutes.get('/img/:userId/:img', (req, res) => {
    const userId = req.params.userId;
    const img = req.params.img;
    const path = fileSystem.getUserImgUrl(userId, img);
    res.sendFile(path);
});
// User login
userRoutes.post('/login', (req, res) => {
    const body = req.body;
    user_1.User.findOne({ userName: body.userName }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                message: 'User or Password are not correct!'
            });
        }
        if (userDB.comparePassword(body.password)) {
            const userToken = token_1.default.getJwtToken({
                _id: userDB._id,
                name: userDB.name,
                lastName: userDB.lastName,
                userName: userDB.userName,
                country: userDB.country,
                img: userDB.img
            });
            res.json({
                ok: true,
                token: userToken,
                user: userDB
            });
        }
        else {
            return res.json({
                ok: false,
                message: 'User or Password are not correct!'
            });
        }
    });
});
// Get ALL users.
userRoutes.get('/all', (req, res) => {
    user_1.User.find((err, usersDB) => {
        if (err)
            throw err;
        res.json({
            ok: true,
            users: usersDB
        });
    });
});
// Get user by Token
userRoutes.get('/', auth_1.verifyToken, (req, res) => {
    const user = req.user;
    res.json({
        ok: true,
        user
    });
});
// Get a user by ID
userRoutes.get('/:id', (req, res) => {
    const id = req.params.id;
    user_1.User.findById(id, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                message: 'The user doesnt exist'
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });
});
// Create a new user
userRoutes.post('/create', (req, res) => {
    const user = {
        name: req.body.name,
        lastName: req.body.lastName,
        userName: req.body.userName,
        password: bcryptjs_1.default.hashSync(req.body.password, 10),
        country: req.body.country,
        img: req.body.img
    };
    user_1.User.create(user).then(userDB => {
        const userToken = token_1.default.getJwtToken({
            _id: userDB._id,
            name: userDB.name,
            lastName: userDB.lastName,
            userName: userDB.userName,
            country: userDB.country,
            img: userDB.img
        });
        res.json({
            ok: true,
            token: userToken
        });
    }).catch(err => {
        res.json({
            ok: false,
            error: err
        });
    });
});
// Update user by ID
userRoutes.post('/update/:id', auth_1.verifyToken, (req, res) => {
    const id = req.params.id;
    const user = {
        name: req.body.name,
        lastName: req.body.lastName,
        userName: req.body.userName,
        // password: bcrypt.hashSync(req.body.password, 10),
        country: req.body.country,
        img: fileSystem.getUserImgName(id)
    };
    user_1.User.findByIdAndUpdate(id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                message: 'The user doesnt exist'
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });
});
// Delete user by ID
userRoutes.post('/delete/:id', (req, res) => {
    const id = req.params.id;
    user_1.User.findByIdAndDelete(id, (err, deletedUserDB) => {
        if (err)
            throw err;
        if (!deletedUserDB) {
            return res.json({
                ok: false,
                message: 'The user doesnt exist'
            });
        }
        res.json({
            ok: true,
            user: deletedUserDB
        });
    });
});
// Upload user image
userRoutes.post('/img/upload', auth_1.verifyToken, (req, res) => __awaiter(this, void 0, void 0, function* () {
    if (!req.files) {
        return res.json({
            ok: false,
            message: 'No file to upload'
        });
    }
    const file = req.files.img;
    if (!file) {
        return res.json({
            ok: false,
            message: 'No file to upload'
        });
    }
    if (!file.mimetype.includes('image')) {
        return res.json({
            ok: false,
            message: 'The file is not an image'
        });
    }
    yield fileSystem.saveUserImg(file, req.user._id);
    res.json({
        ok: true,
        file: file.mimetype
    });
}));
exports.default = userRoutes;
