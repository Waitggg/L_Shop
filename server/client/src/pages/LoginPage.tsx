import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { RegisterPageProps, ErrorWithMessage } from '../types/authTypes';

function LoginPage({ setIsAuth }: RegisterPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Ошибка входа');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);

      setIsAuth(true);
      navigate('/profile');
      
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || 'Ошибка входа');
    }
  };

  return (
    <div className="auth-container">
      <h2>Вход</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit">Войти</button>
      </form>
      
      <p>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </div>
  );
}

export default LoginPage;