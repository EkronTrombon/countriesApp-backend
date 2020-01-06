import Server from './classes/server';
import userRoutes from './routes/user';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import postRoutes from './routes/post';
import fileUpload from 'express-fileupload';


const server = new Server();

// Bdy parser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// File Upload
server.app.use(fileUpload());

// Configuración CORS
server.app.use(cors({ origin: true, credentials: true }));

// App routes
server.app.use('/user', userRoutes);
server.app.use('/post', postRoutes);

// MongoDB
mongoose.connect(server.urlDB, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err) throw err;
    console.log('DataBase ONLINE!');
});

// Run the server
server.start(() => {
    console.log(`Server running in port ${server.port}`);
});