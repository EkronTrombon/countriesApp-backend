import express from 'express';

export default class Server {
    public app: express.Application;
    public port: number = 3000;
    public env: string = 'dev';
    public urlDB: string = '';

    constructor() {
        this.app = express();
        this.urlDB = 'mongodb://localhost:27017/countriesApp';
    }
    
    start(callback: any) {
        this.app.listen(this.port, callback);
    }
}