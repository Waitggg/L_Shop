import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { createUser } from './controllers/auth_controller';
import { User } from './types/users';
import { authMiddleware } from './services/auth_validator';
import { login, register, profile, logout, getGames } from './routes/server_routes';
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
app.get('/api/games', getGames);


app.post('/api/logout', logout);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
