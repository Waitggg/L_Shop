import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { RegisterPageProps, ErrorWithMessage } from '../types/authTypes';
import { useCart}   from '../cartContext';

interface UserData {
  id: string;
  email: string;
  role: string;
  creationDate: string;
}

function ProfilePage({ setIsAuth }: RegisterPageProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {cart} = useCart();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        handleLogout();
        return;
      }

      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': token
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error('Ошибка загрузки данных');
      }

      const data = await response.json();
      setUserData(data.user);
      
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || 'Ошибка загрузки профиля');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      setIsAuth(false);
      navigate('/login');
    } else {
      console.error('Ошибка при выходе');
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
};

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error">{error}</div>
        <button onClick={handleLogout} className="logout-button">
          Вернуться на главную
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <header className="xenon-header">
          <div className="logo">
              <h2>XenonZap</h2>
          </div>
          <nav className="header-nav">
              <Link to="/" className="cart-btn" style={{width: 101, paddingRight: 38, paddingLeft: 38}}>На главную</Link>
              <Link to="/cart" className="cart-btn">🛒 Корзина {cart.totalItems > 0 && `(${cart.totalItems})`}</Link>
          </nav>
      </header>
      <div className="profile-container">
      </div>


      {userData && (
        <div className="profile-info">
          <h2>Профиль пользователя</h2>
          <div className="info-item">
            <span className="info-label">Email: </span>
            <span className="info-value">{userData.email}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Роль: </span>
            <span className="info-value">{userData.role || 'Пользователь'}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Дата регистрации: </span>
            <span className="info-value">
              {new Date(userData.creationDate).toLocaleDateString('ru-RU')}
            </span>
          </div>
                  <button onClick={handleLogout} className="logout-button">
          Выйти из аккаунта
        </button>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;