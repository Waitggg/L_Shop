import { Request, Response } from 'express';
import { validateAuth } from '../services/auth_validator';
import { authUser, createUser } from '../controllers/auth_controller';
import { User } from '../types/users';
import fs from 'fs';
import path from 'path';

interface Game {
  id: number;
  title: string;
  price: number;
  genre: string;
  rating: number;
  image: string;
}

interface GamesData {
  games: Game[];
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const validateError = validateAuth(req.body);
    if (validateError?.error) {
      res.status(400).json({ validateError });
      return;
    }

    const isSuccessful = await authUser(req.body);
    res.json(isSuccessful);
  } catch (error: unknown) {
    console.error('Ошибка авторизации:', error);
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const validateError = validateAuth(req.body);
    if (validateError?.error) {
      res.status(400).json({ validateError });
      return;
    }

    const newUser = await User.createNew(req.body.email, req.body.password);
    const isSuccessful = await createUser(newUser);
    res.json(isSuccessful);
  } catch (error: unknown) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
}

export const profile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      user: user
    });
  } catch (error: unknown) {
    console.error('Profile error:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
};

export const getGames = async (req: Request, res: Response): Promise<void> => {
  try {
    const gamesPath: string = path.join(__dirname, '..', 'db', 'games.json');
    if (fs.existsSync(gamesPath)) {
      const fileContent: string = fs.readFileSync(gamesPath, 'utf8');
      const data: GamesData = JSON.parse(fileContent);
      res.json(data.games);
    } else {
      res.status(404).json({
        success: false,
        message: "Файл games.json не найден в директории db"
      });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Games fetch error:', errorMessage);
    res.status(500).json({
      success: false,
      message: 'Ошибка при чтении базы данных игр'
    });
  }
};