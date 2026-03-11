import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { AuthRequestBody,  ValidationResult} from '../types/users';
import { User } from '../types/users';

export function validateAuth(body : AuthRequestBody) : ValidationResult
{
    if(!body) return { success: false, error: 'Тело запроса пустое!!!!!!! БАН' };
    const { email, password } = body;
    if (!email || !password) {
      return { success: false, error: 'Email и пароль обязательны' };
    }
      return { success: true, error: null };
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {
    const token = req.cookies?.auth_token;
    if (!token) {
      res.status(401).json({ //return
        success: false, 
        message: 'Не авторизован' 
      });
      return;
    }
    
    const filePath = path.resolve(__dirname, '../db/users.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const user = data.users.find((u: User) => u.token === token);
    if (!user) {
      res.status(401).json({ //return
        success: false, 
        message: 'Недействительный токен' 
      });
      return;
    }
    
    req.user = user;
    next();
    } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка авторизации' 
    });
    return;
  }
}