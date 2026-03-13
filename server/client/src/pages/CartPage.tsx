import React, { useState } from 'react';
import { useCart } from '../cartContext';
import { Link, useNavigate } from 'react-router-dom';
import '../CartPage.css';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, loading, error } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Проверяем авторизацию
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    // Здесь будет логика оформления заказа
    alert('Функция оформления заказа в разработке');
  };

  if (loading) {
    return (
      <div className="cart-container">
        <header className="xenon-header">
          <div className="logo"><h2>XenonZap</h2></div>
          <div className="search-bar">
            <input type="text" placeholder="Поиск игр..." value={searchQuery} readOnly />
          </div>
          <nav className="header-nav">
            <Link to="/login" className="nav-link">🖥️ Личный кабинет</Link>
            <Link to="/" className="cart-btn">На главную</Link>
          </nav>
        </header>
        <div className="cart-empty">
          <h2>Загрузка корзины...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container">
        <header className="xenon-header">
          <div className="logo"><h2>XenonZap</h2></div>
          <div className="search-bar">
            <input type="text" placeholder="Поиск игр..." value={searchQuery} readOnly />
          </div>
          <nav className="header-nav">
            <Link to="/login" className="nav-link">🖥️ Личный кабинет</Link>
            <Link to="/" className="cart-btn">На главную</Link>
          </nav>
        </header>
        <div className="cart-empty">
          <h2>Ошибка</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="continue-shopping">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="cart-container">
        <header className="xenon-header">
          <div className="logo"><h2>XenonZap</h2></div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Поиск игр..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <nav className="header-nav" style={{marginRight:0}}>
            <Link to="/login" className="nav-link">🖥️ Личный кабинет</Link>
            <Link to="/" className="cart-btn" style={{width: 101, paddingRight: 38, paddingLeft: 38}}>
              На главную
            </Link>
          </nav>
        </header>
        <div className="cart-empty">
          <h2>Корзина пуста</h2>
          <p>Добавьте игры, чтобы продолжить</p>
          <Link to="/" className="continue-shopping">Продолжить покупки</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <header className="xenon-header">
        <div className="logo"><h2>XenonZap</h2></div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Поиск игр..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <nav className="header-nav" style={{marginRight:0}}>
          <Link to="/login" className="nav-link">🖥️ Личный кабинет</Link>
          <Link to="/" className="cart-btn" style={{width: 101, paddingRight: 38, paddingLeft: 38}}>
            На главную
          </Link>
        </nav>
      </header>
      
      <div className="cart-items">
        {cart.items.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.title} className="cart-item-image" />
            
            <div className="cart-item-info">
              <h3>{item.title}</h3>
              <p className="cart-item-price">${item.price}</p>
            </div>

            <div className="cart-item-quantity">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >-</button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                disabled={item.quantity >= 50}
              >+</button>
            </div>

            <div className="cart-item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>

            <button 
              className="cart-item-remove"
              onClick={() => removeFromCart(item.id)}
            >×</button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-totals">
          <p>Всего товаров: <span>{cart.totalItems}</span></p>
          <p>Общая сумма: <span>${cart.totalPrice.toFixed(2)}</span></p>
        </div>

        <div className="cart-actions">
          <button onClick={clearCart} className="clear-cart">Очистить корзину</button>
          <button onClick={handleCheckout} className="checkout-btn">Оформить заказ</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;