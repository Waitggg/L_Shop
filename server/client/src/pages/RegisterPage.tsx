import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { RegisterPageProps, ErrorWithMessage } from '../types/authTypes';

function RegisterPage({ setIsAuth }:RegisterPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
        const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Ошибка регистрации');
      }
      
      // После регистрации - логинимся
      const loginResponse = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!loginResponse.ok) {
        throw new Error('Ошибка при входе');
      }
      
      const loginData = await loginResponse.json();
      localStorage.setItem('token', loginData.token);
      
      setIsAuth(true);
      navigate('/api/profile');
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || "Ошибка");
    }
  };

  return (
    <div className="auth-container">
      <h2>Регистрация</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Подтвердите пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
}

export default RegisterPage;