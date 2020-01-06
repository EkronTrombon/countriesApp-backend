import { Router, Request, Response } from 'express';
import { User } from '../models/user';
import bcrypt from 'bcryptjs';
import Token from '../classes/token';
import { verifyToken } from '../middlewares/auth';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../classes/file-system';

const userRoutes = Router();
const fileSystem = new FileSystem();

// Get user Image
userRoutes.get('/img/:userId/:img', (req: any, res: Response) => {
    const userId = req.params.userId;
    const img = req.params.img;
    const path = fileSystem.getUserImgUrl(userId, img);
    res.sendFile(path);
});

// User login
userRoutes.post('/login', (req: Request, res: Response) => {
    const body = req.body;
    User.findOne({userName: body.userName}, (err, userDB) => {
        if (err) throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                message: 'User or Password are not correct!'
            });
        }
        if (userDB.comparePassword(body.password)) {
            const userToken = Token.getJwtToken({
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
        } else {
            return res.json({
                ok: false,
                message: 'User or Password are not correct!'
            });
        }
    });
});

// Get ALL users.
userRoutes.get('/all', (req: Request, res: Response) => {
    User.find((err, usersDB) => {
        if (err) throw err;
        res.json({
            ok: true,
            users: usersDB
        });
    });
});

// Get user by Token
userRoutes.get('/', verifyToken, (req: any, res: Response) => {
    const user = req.user;
    res.json({
        ok: true,
        user
    });
});

// Get a user by ID
userRoutes.get('/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    User.findById(id, (err, userDB) => {
        if (err) throw err;
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
userRoutes.post('/create', (req: Request, res: Response) => {
    const user = {
        name: req.body.name,
        lastName: req.body.lastName,
        userName: req.body.userName,
        password: bcrypt.hashSync(req.body.password, 10),
        country: req.body.country,
        img: req.body.img
    };
    User.create(user).then(userDB => {
        const userToken = Token.getJwtToken({
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
userRoutes.post('/update/:id', verifyToken , (req: Request, res: Response) => {
    const id = req.params.id;
    const user = {
        name: req.body.name,
        lastName: req.body.lastName,
        userName: req.body.userName,
        // password: bcrypt.hashSync(req.body.password, 10),
        country: req.body.country,
        img: fileSystem.getUserImgName(id)
    };
    User.findByIdAndUpdate(id, user, { new: true }, (err, userDB) => {
        if (err) throw err;
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
userRoutes.post('/delete/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    User.findByIdAndDelete(id, (err, deletedUserDB) => {
        if (err) throw err;
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
userRoutes.post('/img/upload', verifyToken, async(req: any, res: Response) => {
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
    await fileSystem.saveUserImg(file, req.user._id);

    res.json({
        ok: true,
        file: file.mimetype
    });
});

export default userRoutes;