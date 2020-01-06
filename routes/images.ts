import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const imgRoutes = Router();

imgRoutes.get('/:type/:img', (req: Request, res: Response) => {
    const type = req.params.type;
    const img = req.params.img;

    const pathUrl = path.resolve(__dirname, `../../uploads/${type}/${img}`);
    if (fs.existsSync(pathUrl)) {
        res.sendFile(pathUrl);
    } else {
        const noUserPath = path.resolve(__dirname, `../assets/noUser.png`);
        res.sendFile(noUserPath);
    }
});

export default imgRoutes;