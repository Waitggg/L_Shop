export interface OrderItem{
	id: number;
	title: string;
	price: number;
	quantity: number;
	image: string;
}

export interface DeliveryAddress{
	street: string;
	city: string;
	postalCode: string;
	country: string;
}

export interface Order{
	id?: string;
	userId: string;
	items: OrderItem[];
	deliveryAddress: DeliveryAddress;
	deliveryDate: string;
	totalPrice: number;
	status: OrderStatus;
	createdAt?: string;
}

export type OrderStatus= 'pending' | 'shipped' | 'delivered' | 'cancelled';

export interface CreateOrderRequest{
	items: OrderItem[];
	deliveryAddress: DeliveryAddress;
	deliveryDate: string;
	totalPrice: number;
}

export interface  CreateOrderResponse {
	success: boolean;
	message: string;
	orderId?: string;
	order?: Order;
}

export interface GetOrdersResponse{
	success: boolean;
	orders?: Order[];
}

export interface GetOrderResponse{
	success: boolean;
	message?: string;
	order?: Order;
}

