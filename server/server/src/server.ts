import express, { Application} from 'express';
import cors from 'cors';
import path from 'path';
import { authMiddleware } from './services/auth_validator';
import { login, register, profile, logout } from './routes/server_routes';
import cookieParser from 'cookie-parser';

const app: Application = express();
const PORT = 3000;

app.use(cors());

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true })); 

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/register', register);

app.post('/api/login', login);

app.get('/api/profile', authMiddleware, profile);

app.post('/api/logout', logout);

app.listen(PORT, () => {
    console.log('enjebado');
});
