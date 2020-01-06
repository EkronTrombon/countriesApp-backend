import { Response, Request, NextFunction } from 'express';
import Token from '../classes/token';

export const verifyToken = (req: any, res: Response, next: NextFunction) => {
    const userToken = req.get('token') || '';
    Token.verifyToken(userToken).then((decoded: any) => {
        req.user = decoded.user;
        next();
    }).catch(err => {
        res.json({
            ok: false,
            message: 'Invalid Token'
        });
    });
};