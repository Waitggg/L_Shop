import { Request, Response } from 'express';
import { validateAuth } from '../services/auth_validator';
import { authUser, createUser } from '../controllers/auth_controller';
import { User } from '../types/users';

const setAuthCookie = (res: Response, token: string) : void => {
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 10 * 60 * 1000,
    path: '/'
  });
};

export async function login(req: Request, res: Response) : Promise<void> {
  try {
    const validateError = validateAuth(req.body);
    if(validateError?.error) {
       res.status(400).json({ validateError }); 
       return;
    }

    const result = await authUser(req.body);
    if (result.success && result.token) {
      setAuthCookie(res, result.token);
      const { token, ...responseWithoutToken } = result;
      res.status(result.status).json(responseWithoutToken);
    } else {
      res.status(result.status).json(result);
    }
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
    return;
  }
};

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const validateError = validateAuth(req.body);
    if (validateError?.error) {
      res.status(400).json({ validateError });
      return;
    }

    const newUser = await User.createNew(req.body.email, req.body.password);
    const result = await createUser(newUser);
    
    if (result.success && result.data?.token) {
      setAuthCookie(res, result.data.token);
      
      const { token, ...userData } = result.data;
      res.status(result.status || 201).json({
        success: true,
        message: result.message,
        user: { 
          id: userData.userId, 
          email: req.body.email 
        }
      });
    } else {
      res.status(result.status || 400).json(result);
    }
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
    return;
  }
}

export const profile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    
    if (!user) {
      res.status(401).json({ success: false, message: 'Пользователь не найден' });
      return;
    }
    
    const { password, token, ...userWithoutSensitive } = user;
    res.status(200).json({
      success: true,
      user: userWithoutSensitive
    });
    
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
    return;
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
    
    res.json({ 
      success: true, 
      message: 'Выход выполнен' 
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Ошибка при выходе' });
  }
};