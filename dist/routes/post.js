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
const auth_1 = require("../middlewares/auth");
const post_1 = require("../models/post");
const file_system_1 = __importDefault(require("../classes/file-system"));
const postRoutes = express_1.Router();
const fileSystem = new file_system_1.default();
// Get Posts (paginated)
postRoutes.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    let skip = page - 1;
    skip = skip * 10;
    const posts = yield post_1.Post.find().sort({ _id: -1 }).skip(skip).limit(10).populate('user', '-password').exec();
    res.json({
        ok: true,
        page,
        posts: posts
    });
}));
// Create new Post
postRoutes.post('/', auth_1.verifyToken, (req, res) => {
    const body = req.body;
    body.user = req.user._id;
    const imgs = fileSystem.moveImgsFromTempToPosts(req.user._id);
    body.img = imgs;
    post_1.Post.create(body).then((postDB) => __awaiter(this, void 0, void 0, function* () {
        yield postDB.populate('user', '-password').execPopulate();
        res.json({
            ok: true,
            post: postDB
        });
    })).catch(err => {
        res.json({
            ok: false,
            error: err
        });
    });
});
// Delete Post by ID
postRoutes.post('/delete/:id', (req, res) => {
    const id = req.params.id;
    post_1.Post.findByIdAndDelete(id, (err, deletedPostDB) => {
        if (err)
            throw err;
        if (!deletedPostDB) {
            return res.json({
                ok: false,
                message: 'The Post does not exist'
            });
        }
        res.json({
            ok: true,
            post: deletedPostDB
        });
    });
});
// Upload post images
postRoutes.post('/upload', auth_1.verifyToken, (req, res) => __awaiter(this, void 0, void 0, function* () {
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
    yield fileSystem.saveTempImg(file, req.user._id);
    res.json({
        ok: true,
        file: file.mimetype
    });
}));
// Get post image
postRoutes.get('/img/:id/:img', (req, res) => {
    const userId = req.params.id;
    const img = req.params.img;
    const pathImg = fileSystem.getImgUrl(userId, img);
    res.sendfile(pathImg);
});
exports.default = postRoutes;
