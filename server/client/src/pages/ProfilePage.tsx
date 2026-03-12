import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RegisterPageProps, ErrorWithMessage } from '../types/authTypes';

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

  // Загружаем данные пользователя при монтировании
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
          // Токен недействителен - выходим
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

  const handleLogout = () => {
    // Удаляем токен
    localStorage.removeItem('token');
    // Обновляем состояние авторизации
    setIsAuth(false);
    // Перенаправляем на страницу входа
    navigate('/login');
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
      <div className="profile-container">
        <div className="error">{error}</div>
        <button onClick={handleLogout} className="logout-button">
          Вернуться на главную
        </button>
      </div>

      <h2>Профиль пользователя</h2>

      {userData && (
        <div className="profile-info">
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
        </div>
      )}
            <div className="profile-header">
        <button onClick={handleLogout} className="logout-button">
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;