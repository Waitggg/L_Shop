import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type {Order, GetOrdersResponse} from '../types/orderTypes'
import '../OrdersPage.css';

const OrdersPage: React.FC = () => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const navigate = useNavigate();
	
	useEffect(() => {
		fetchOrders();
	}, []);
	
	const fetchOrders = async (): Promise<void> => {
		try {
			setLoading(true);
			const response = await fetch('/api/orders', {
				credentials: 'include'
			});
			
			if (!response.ok) {
				if (response.status === 401) {
					navigate('/login');
					return;
				}
				throw new Error('Ошибка загрузки заказов');
			}
			
			const data = await response.json() as GetOrdersResponse;
			setOrders(data.orders || []);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};
	
	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleDateString('ru-RU', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};
	
	const getStatusColor = (status: string): string => {
		switch (status) {
			case 'pending':
				return '#FFA500';
			case 'shipped':
				return '#66c0f4';
			case 'delivered':
				return '#a3cf06';
			case 'cancelled':
				return '#ff6464';
			default:
				return '#888';
		}
	};
	
	const getStatusText = (status: string): string => {
		switch (status) {
			case 'pending':
				return 'Ожидание';
			case 'shipped':
				return 'Отправлен';
			case 'delivered':
				return 'Доставлен';
			case 'cancelled':
				return 'Отменён';
			default:
				return status;
		}
	};
	
	if (loading) {
		return (
			<div className="orders-container">
				<h1>Загрузка...</h1>
			</div>
		);
	}
	
	return (
		<div className="orders-container">
			<header className="xenon-header">
				<div className="logo">
					<h2>XenonZap</h2>
				</div>
				<nav className="header-nav">
					<Link to="/" className="cart-btn" style={{ width: 101, paddingRight: 38, paddingLeft: 38 }}>
						На главную
					</Link>
				</nav>
			</header>
			
			<div className="orders-content">
				<h1>Мои заказы</h1>
				
				{error && <div className="error-message">{error}</div>}
				
				{orders.length === 0 ? (
					<div className="no-orders">
						<p>У вас ещё нет заказов</p>
						<Link to="/" className="continue-shopping-btn">
							Начать покупки
						</Link>
					</div>
				) : (
					<div className="orders-list">
						{orders.map((order: Order) => (
							<div key={order.id} className="order-card">
								<div className="order-header">
									<div className="order-info">
										<h3>Заказ #{order.id}</h3>
										<p className="order-date">
											от {formatDate(order.createdAt)}
										</p>
									</div>
									<div
										className="order-status"
										style={{ backgroundColor: getStatusColor(order.status) }}
									>
										{getStatusText(order.status)}
									</div>
								</div>
								
								<div className="order-body">
									<div className="delivery-info">
										<h4>Адрес доставки:</h4>
										<p>
											{order.deliveryAddress.street}, {order.deliveryAddress.city}
										</p>
										<p>{order.deliveryAddress.postalCode}</p>
										<p>Телефон: {order.deliveryAddress.phone}</p>
										<h4 style={{ marginTop: '15px' }}>Дата доставки:</h4>
										<p>{formatDate(order.deliveryDate)}</p>
									</div>
									
									<div className="items-summary">
										<h4>Товары ({order.items.length}):</h4>
										{order.items.map((item) => (
											<div key={item.id} className="item-summary">
												<span>{item.title}</span>
												<span>{item.quantity}x ${item.price}</span>
											</div>
										))}
									</div>
								</div>
								
								<div className="order-footer">
									<div className="order-total-price">
										Итого: <span>${order.totalPrice.toFixed(2)}</span>
									</div>
									<Link
										to={`/order/${order.id}`}
										className="view-details-btn"
									>
										Подробнее
									</Link>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default OrdersPage;