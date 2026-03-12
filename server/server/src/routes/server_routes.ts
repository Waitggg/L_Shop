import { Request, Response } from 'express';
import { validateAuth } from '../services/auth_validator';
import { authUser, createUser } from '../controllers/auth_controller';
import { User } from '../types/users';
import fs from 'fs';
import path from 'path';

export async function login(req: Request, res: Response) {
  try {
    const validateError = validateAuth(req.body);
    if(validateError?.error) return res.status(400).json({ validateError });

    const isSuccessful = await authUser(req.body);
    res.json(isSuccessful);
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
};

export async function register (req: Request, res: Response) {
  try {
    const validateError = validateAuth(req.body);
    if(validateError?.error) return res.status(400).json({ validateError });

    // Обратите внимание: метод createNew должен быть реализован в вашем классе User
    const newUser = await User.createNew(req.body.email, req.body.password);

    const isSuccessful = await createUser(newUser);
    res.json(isSuccessful);
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
};

export const profile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    res.status(200).json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
};

export const getGames = async (req: Request, res: Response) => {
  try {
    const gamesPath = path.join(__dirname, '..', 'db', 'games.json');

    if (fs.existsSync(gamesPath)) {
      const data = fs.readFileSync(gamesPath, 'utf8');
      res.json(JSON.parse(data));
    } else {
      res.status(404).json({
        success: false,
        message: "Файл games.json не найден в директории db"
      });
    }
  } catch (error) {
    console.error('Games fetch error:', error);
    res.status(500).json({ success: false, message: 'Ошибка при чтении базы данных игр' });
  }
};