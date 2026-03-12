import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { authMiddleware } from './services/auth_validator';
import { login, register, profile, getGames } from './routes/server_routes';

const app: Application = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/register', register);
app.post('/api/login', login);
app.get('/api/profile', authMiddleware, profile);
app.get('/api/games', getGames);
app.get('/api/products', (req: Request, res: Response) => {
    res.send({ data: [{ id: 1, title: "kbp" }] });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});