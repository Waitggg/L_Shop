import fs from 'fs';
import path from 'path';
import {
	Order,
	OrderStatus,
	CreateOrderRequest,
	CreateOrderResponse,
	GetOrdersResponse,
	GetOrderResponse
} from '../types/orders';
import { User } from '../types/users';

interface OrdersDatabase {
	orders: Order[];
}

function readOrdersDatabase(): OrdersDatabase {
	const filePath = path.resolve(__dirname, '../db/orders.json');
	const rawData = fs.readFileSync(filePath, 'utf8');
	return JSON.parse(rawData) as OrdersDatabase;
}

function writeOrdersDatabase(data: OrdersDatabase): void {
	const filePath = path.resolve(__dirname, '../db/orders.json');
	fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

export async function createOrder(
	user: User,
	orderData: CreateOrderRequest
): Promise<CreateOrderResponse> {
	try {
		
		if (!user || !user.id) {
			return {
				success: false,
				message: 'Пользователь не авторизован'
			};
		}
		
		if (!orderData.items || orderData.items.length === 0) {
			return {
				success: false,
				message: 'Заказ пуст'
			};
		}
		
		if (!orderData.deliveryAddress || !orderData.deliveryDate) {
			return {
				success: false,
				message: 'Нужно указать адрес и дату доставки'
			};
		}
		
		const deliveryDate = new Date(orderData.deliveryDate);
		const today = new Date();
		if (deliveryDate < today) {
			return {
				success: false,
				message: 'Дата доставки должна быть в будущем'
			};
		}
		
		const database = readOrdersDatabase();
		
		const orderId = Date.now().toString();
		
		const newOrder: Order = {
			id: orderId,
			userId: user.id,
			items: orderData.items,
			deliveryAddress: orderData.deliveryAddress,
			deliveryDate: orderData.deliveryDate,
			totalPrice: orderData.totalPrice,
			status: 'pending' as OrderStatus,
			createdAt: new Date().toISOString()
		};
		
		database.orders.push(newOrder);
		writeOrdersDatabase(database);
		
		return {
			success: true,
			message: 'Заказ успешно создан',
			orderId: orderId,
			order: newOrder
		};
	} catch (error) {
		console.error('Ошибка при создании заказа:', error);
		return {
			success: false,
			message: 'Неизвестная ошибка'
		};
	}
}

export async function getUserOrders(userId: string): Promise<Order[]> {
	try {
		const database = readOrdersDatabase();
		
		const userOrders = database.orders.filter(
			(order: Order) => order.userId === userId
		);
		
		return userOrders.sort(
			(a: Order, b: Order) =>
				new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
		);
	} catch (error) {
		console.error('Ошибка при получении заказов:', error);
		return [];
	}
}

export async function getOrderById(
	orderId: string,
	userId: string
): Promise<Order | null> {
	try {
		const database = readOrdersDatabase();
		
		const order = database.orders.find(
			(o: Order) => o.id === orderId
		);
		
		if (order && order.userId === userId) {
			return order;
		}
		
		return null;
	} catch (error) {
		console.error('Ошибка при получении заказа:', error);
		return null;
	}
}
