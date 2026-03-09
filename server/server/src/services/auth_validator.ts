import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

export function validateAuth(body : any)
{
    if(!body) return { success: false, error: 'Тело запроса пустое!!!!!!! БАН' };
    const { email, password } = body;
    if (!email || !password) {
      return { success: false, error: 'Email и пароль обязательны' };
    }
      return { success: true, error: null };
}

export function getId()
{
  const filePath = path.resolve(__dirname, '../db/users.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return data.users.length;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Не авторизован' 
      });
    }
    
    const filePath = path.resolve(__dirname, '../db/users.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const user = data.users.find((u: any) => u.token === token);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Недействительный токен' 
      });
    }
    
    (req as any).user = user;
    next();
    } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка авторизации' 
    });
  }
}