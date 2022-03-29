import morgan from 'morgan';
import path from 'path';
import http from 'http';
import helmet from 'helmet';
import express, { Request, Response } from 'express';

import BaseRouter from './routes/api';

const app = express();

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

// Add APIs
app.use('/api', BaseRouter);

/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Login page
app.get('/', (req: Request, res: Response) => {
    return res.sendFile('login.html', {root: viewsDir});
});



/************************************************************************************
 *                              Export Server
 ***********************************************************************************/

const server = http.createServer(app);
export default server;
