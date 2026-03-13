import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../OrderSuccessPage.css';

const OrderSuccessPage: React.FC = () => {
	const { orderId } = useParams<{ orderId?: string }>();
	const navigate = useNavigate();
	const [showConfetti, setShowConfetti] = useState(true);
	
	useEffect(() => {
		if (!orderId) {
			navigate('/');
			return;
		}
		
		const timer = setTimeout((): void => {
			setShowConfetti(false);
		}, 3000);
		
		return (): void => {
			clearTimeout(timer);
		};
	}, [orderId, navigate]);
	
	if (!orderId) {
		return null;
	}
	
	return (
		<div className="success-container">
			{showConfetti && (
				<div className="confetti-container">
					{[...Array(50)].map((_, i: number) => (
						<div key={i} className="confetti-piece"></div>
					))}
				</div>
			)}
			
			<div className="success-content">
				<div className="success-icon">✓</div>
				
				<h1>Заказ успешно создан!</h1>
				
				<p className="order-id">
					Номер вашего заказа: <strong>#{orderId}</strong>
				</p>
				
				<p className="success-message">
					Спасибо за покупку! Мы отправим товар в соответствии с выбранной вами датой доставки.
				</p>
				
				<p className="tracking-info">
					Вы можете отследить статус заказа в разделе "Мои заказы"
				</p>
				
				<div className="action-buttons">
					<Link to="/orders" className="btn btn-primary">
						Посмотреть все заказы
					</Link>
					<Link to="/" className="btn btn-secondary">
						Продолжить покупки
					</Link>
				</div>
			</div>
		</div>
	);
};

export default OrderSuccessPage;