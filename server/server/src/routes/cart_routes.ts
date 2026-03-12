import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const CARTS_FILE = path.join(__dirname, '../../db/carts.json');

// Вспомогательная функция для чтения корзин
const readCarts = () => {
  try {
    // Проверяем, существует ли директория db
    const dbDir = path.join(__dirname, '../../db');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    // Проверяем, существует ли файл
    if (!fs.existsSync(CARTS_FILE)) {
      // Если файла нет, создаем его с пустой структурой
      const initialData = { carts: [] };
      fs.writeFileSync(CARTS_FILE, JSON.stringify(initialData, null, 2), 'utf8');
      return initialData;
    }
    
    const data = fs.readFileSync(CARTS_FILE, 'utf8');
    const parsed = JSON.parse(data);
    
    // Проверяем структуру
    if (!parsed.carts) {
      return { carts: [] };
    }
    
    return parsed;
  } catch (error) {
    console.error('Error reading carts file:', error);
    return { carts: [] };
  }
};

// Вспомогательная функция для записи корзин
const writeCarts = (data: any) => {
  try {
    // Проверяем, существует ли директория db
    const dbDir = path.join(__dirname, '../../db');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    // Записываем файл
    fs.writeFileSync(CARTS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing carts file:', error);
    throw error; // Пробрасываем ошибку дальше
  }
};

// Получить корзину пользователя
export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Не авторизован' });
      return;
    }

    const { carts } = readCarts();
    const userCart = carts.find((cart: any) => cart.userId === user.id);

    res.json({
      success: true,
      cart: userCart || { userId: user.id, items: [] }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
};

// Добавить товар в корзину
export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Не авторизован' });
      return;
    }

    const { id, title, price, image } = req.body;
    if (!id || !title || !price) {
      res.status(400).json({ success: false, message: 'Не все данные товара' });
      return;
    }

    const data = readCarts();
    let userCart = data.carts.find((cart: any) => cart.userId === user.id);

    if (!userCart) {
      userCart = {
        userId: user.id,
        items: [],
        updatedAt: new Date().toISOString()
      };
      data.carts.push(userCart);
    }

    const existingItem = userCart.items.find((item: any) => item.id === id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      userCart.items.push({
        id,
        title,
        price,
        image,
        quantity: 1
      });
    }

    userCart.updatedAt = new Date().toISOString();
    writeCarts(data);

    res.json({
      success: true,
      cart: userCart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
};

// Обновить количество товара
export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Не авторизован' });
      return;
    }

    // Исправление: проверяем и преобразуем id в число
    const idParam = req.params.id;
    if (Array.isArray(idParam)) {
      res.status(400).json({ success: false, message: 'Некорректный ID товара' });
      return;
    }
    
    const itemId = parseInt(idParam, 10);
    if (isNaN(itemId)) {
      res.status(400).json({ success: false, message: 'ID товара должен быть числом' });
      return;
    }

    const { quantity } = req.body;
    if (typeof quantity !== 'number' || quantity < 1 || quantity > 50) {
      res.status(400).json({ success: false, message: 'Недопустимое количество (1-50)' });
      return;
    }

    const data = readCarts();
    const userCart = data.carts.find((cart: any) => cart.userId === user.id);

    if (!userCart) {
      res.status(404).json({ success: false, message: 'Корзина не найдена' });
      return;
    }

    const item = userCart.items.find((item: any) => item.id === itemId);
    if (!item) {
      res.status(404).json({ success: false, message: 'Товар не найден' });
      return;
    }

    item.quantity = quantity;
    userCart.updatedAt = new Date().toISOString();
    writeCarts(data);

    res.json({
      success: true,
      cart: userCart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
};

// Удалить товар из корзины
export const removeFromCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Не авторизован' });
      return;
    }

    // Исправление: проверяем и преобразуем id в число
    const idParam = req.params.id;
    if (Array.isArray(idParam)) {
      res.status(400).json({ success: false, message: 'Некорректный ID товара' });
      return;
    }
    
    const itemId = parseInt(idParam, 10);
    if (isNaN(itemId)) {
      res.status(400).json({ success: false, message: 'ID товара должен быть числом' });
      return;
    }

    const data = readCarts();
    const userCart = data.carts.find((cart: any) => cart.userId === user.id);

    if (!userCart) {
      res.status(404).json({ success: false, message: 'Корзина не найдена' });
      return;
    }

    userCart.items = userCart.items.filter((item: any) => item.id !== itemId);
    userCart.updatedAt = new Date().toISOString();
    writeCarts(data);

    res.json({
      success: true,
      cart: userCart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
};

// Очистить корзину
export const clearCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Не авторизован' });
      return;
    }

    const data = readCarts();
    const userCart = data.carts.find((cart: any) => cart.userId === user.id);

    if (userCart) {
      userCart.items = [];
      userCart.updatedAt = new Date().toISOString();
      writeCarts(data);
    }

    res.json({
      success: true,
      cart: userCart || { userId: user.id, items: [] }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
};