import { Request, Response } from 'express';
import { validateAuth } from '../services/auth_validator';
import { authUser, createUser } from '../controllers/auth_controller';
import { User } from '../types/users';
import fs from 'fs';
import path from 'path';

import {
  createOrder,
  getUserOrders,
  getOrderById,
} from '../controllers/orders_controller';
import {
  CreateOrderRequest,
  GetOrdersResponse,
  GetOrderResponse
} from '../types/orders';

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


export const createNewOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user as User | undefined;
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Не авторизован'
      });
      return;
    }
    
    const orderData = req.body as CreateOrderRequest;
    const result = await createOrder(user, orderData);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
};


export const getUserOrdersRoute = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user as User | undefined;
    
    if (!user || !user.id) {
      res.status(401).json({
        success: false,
        message: 'Не авторизован'
      });
      return;
    }
    
    const orders = await getUserOrders(user.id);
    
    const response: GetOrdersResponse = {
      success: true,
      orders: orders
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Ошибка при получении заказов:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
};


export const getOrderByIdRoute = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user as User | undefined;
    const { orderId } = req.params as { orderId: string };
    
    if (!user || !user.id) {
      res.status(401).json({
        success: false,
        message: 'Не авторизован'
      });
      return;
    }
    
    const order = await getOrderById(orderId, user.id);
    
    const response: GetOrderResponse = {
      success: order !== null,
      order: order || undefined,
      message: order ? undefined : 'Заказ не найден'
    };
    
    if (order) {
      res.status(200).json(response);
    } else {
      res.status(404).json(response);
    }
  } catch (error) {
    console.error('Ошибка при получении заказа:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
};