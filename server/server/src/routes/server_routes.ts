import { Request, Response } from 'express';
import { validateAuth } from '../services/auth_validator';
import { authUser, createUser } from '../controllers/auth_controller';
import { User } from '../types/users';

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
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
}