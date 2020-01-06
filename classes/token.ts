import jwt from 'jsonwebtoken';

export default class Token {
    private static seed: string = 'this_is_my_secret_seed_of_my_application';
    private static life: string = '30d'; // 30 days of life for my token

    constructor() {}

    static getJwtToken(payload: any): string {
        return jwt.sign({
            user: payload
        }, this.seed, { expiresIn: this.life });
    }

    static verifyToken(token: string) {
        return new Promise((resolve, reject) => {
            jwt.verify( token, this.seed, (err, decoded) => {
                if (err) {
                    reject();
                } else {
                    resolve(decoded);
                }
            });
        });
    }
}