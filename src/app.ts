import express, { Express, Request, Response } from 'express';
import config from 'config';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';
import routes from './routes/';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { handleApiError } from './utils/apiError';
import { configurePassport } from './utils/passport';

configurePassport();

const passport = require('passport');

const app: Express = express();

app.use(passport.initialize());

const allowedOrigin = config.get<string>('clientApp.rootUrl');

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || origin === allowedOrigin) {
            callback(null, true);
        } else {
            console.log('Not allowed by CORS');
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());

app.use('/', routes);

app.use('*', (req: Request, res: Response) => {
    return res.status(404).json({
        success: false,
        message: 'Invalid route'
    });
});

app.use(handleApiError);

export default app;
