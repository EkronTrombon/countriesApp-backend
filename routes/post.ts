import { Router, Response, Request } from 'express';
import { verifyToken } from '../middlewares/auth';
import { Post } from '../models/post';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../classes/file-system';

const postRoutes = Router();
const fileSystem = new FileSystem();

// Get Posts (paginated)
postRoutes.get('/', async(req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    let skip = page - 1;
    skip = skip * 10;
    const posts = await Post.find().sort({ _id: -1 }).skip(skip).limit(10).populate('user', '-password').exec();
    res.json({
        ok: true,
        page,
        posts: posts
    });
});

// Create new Post
postRoutes.post('/', verifyToken, (req: any, res: Response) => {
    const body = req.body;
    body.user = req.user._id;
    const imgs = fileSystem.moveImgsFromTempToPosts(req.user._id);
    body.img = imgs;
    Post.create(body).then(async(postDB) => {
        await postDB.populate('user', '-password').execPopulate();
        res.json({
            ok: true,
            post: postDB
        });
    }).catch(err => {
        res.json({
            ok: false,
            error: err
        });
    });
});

// Upload post images
postRoutes.post('/upload', verifyToken, async(req: any, res: Response) => {
    if (!req.files) {
        return res.json({
            ok: false,
            message: 'No file to upload'
        });
    }
    const file: FileUpload = req.files.img;
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
    await fileSystem.saveTempImg(file, req.user._id);

    res.json({
        ok: true,
        file: file.mimetype
    });
});

// Get post image
postRoutes.get('/img/:id/:img', (req: any, res: Response) => {
    const userId = req.params.id;
    const img = req.params.img;
    const pathImg = fileSystem.getImgUrl(userId, img);
    res.sendfile(pathImg);
});

export default postRoutes;