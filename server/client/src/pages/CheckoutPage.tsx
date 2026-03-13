import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../cartContext';
import type {
	CreateOrderRequest,
	DeliveryAddress,
	CreateOrderResponse
} from '../types/orderTypes'
import '../CheckoutPage.css';

interface CheckoutFormData extends DeliveryAddress {
	deliveryDate: string;
}

const CheckoutPage: React.FC = () => {
	const { cart, clearCart } = useCart();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	
	const [formData, setFormData] = useState<CheckoutFormData>({
		street: '',
		city: '',
		postalCode: '',
		phone: '',
		deliveryDate: ''
	});
	
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = e.target;
		setFormData((prev: CheckoutFormData) => ({
			...prev,
			[name]: value
		}));
	};
	
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		setLoading(true);
		setError('');
		
		try {
			if (
				!formData.street ||
				!formData.city ||
				!formData.postalCode ||
				!formData.phone ||
				!formData.deliveryDate
			) {
				setError('Пожалуйста, заполните все поля');
				setLoading(false);
				return;
			}
			
			if (cart.items.length === 0) {
				setError('Корзина пуста');
				setLoading(false);
				return;
			}
			
			const orderData: CreateOrderRequest = {
				items: cart.items,
				deliveryAddress: {
					street: formData.street,
					city: formData.city,
					postalCode: formData.postalCode,
					phone: formData.phone
				},
				deliveryDate: formData.deliveryDate,
				totalPrice: cart.totalPrice
			};
			
			const response = await fetch('/api/orders', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(orderData)
			});
			
			if (!response.ok) {
				const errorData = await response.json() as { message: string };
				throw new Error(errorData.message || 'Ошибка при создании заказа');
			}
			
			const result = await response.json() as CreateOrderResponse;
			
			await clearCart();
			
			if (result.orderId) {
				navigate(`/order-success/${result.orderId}`);
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};
	
	return (
		<div className="checkout-container">
			<h1>Оформление заказа</h1>
			
			<div className="checkout-content">
				<div className="checkout-form">
					<h2>Адрес доставки</h2>
					{error && <div className="error-message">{error}</div>}
					
					<form onSubmit={handleSubmit}>
						<div className="form-group">
							<label htmlFor="street">Улица</label>
							<input
								type="text"
								id="street"
								name="street"
								value={formData.street}
								onChange={handleInputChange}
								placeholder="Например: Дзержинского 101"
								required
							/>
						</div>
						
						<div className="form-group">
							<label htmlFor="city">Город</label>
							<input
								type="text"
								id="city"
								name="city"
								value={formData.city}
								onChange={handleInputChange}
								placeholder="Например: Минск"
								required
							/>
						</div>
						
						<div className="form-group">
							<label htmlFor="postalCode">Почтовый индекс</label>
							<input
								type="text"
								id="postalCode"
								name="postalCode"
								value={formData.postalCode}
								onChange={handleInputChange}
								placeholder="Например: 125009"
								required
							/>
						</div>
						
						<div className="form-group">
							<label htmlFor="phone">Телефон</label>
							<input
								type="tel"
								id="phone"
								name="phone"
								value={formData.phone}
								onChange={handleInputChange}
								placeholder="Например: +375333188393"
								required
							/>
						</div>
						
						<div className="form-group">
							<label htmlFor="deliveryDate">Дата доставки</label>
							<input
								type="date"
								id="deliveryDate"
								name="deliveryDate"
								value={formData.deliveryDate}
								onChange={handleInputChange}
								required
							/>
						</div>
						
						<button
							type="submit"
							disabled={loading}
							className="submit-button"
						>
							{loading ? 'Оформление...' : 'Подтвердить заказ'}
						</button>
					</form>
				</div>
				
				<div className="checkout-summary">
					<h2>Ваш заказ</h2>
					
					<div className="order-items">
						{cart.items.map((item) => (
							<div key={item.id} className="order-item">
								<img src={item.image} alt={item.title} />
								<div className="item-details">
									<h4>{item.title}</h4>
									<p>{item.quantity} x ${item.price}</p>
									<p className="item-total">
										${(item.price * item.quantity).toFixed(2)}
									</p>
								</div>
							</div>
						))}
					</div>
					
					<div className="order-total">
						<div className="total-row">
							<span>Товаров:</span>
							<span>{cart.totalItems}</span>
						</div>
						<div className="total-row">
							<span>Сумма:</span>
							<span>${cart.totalPrice.toFixed(2)}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CheckoutPage;