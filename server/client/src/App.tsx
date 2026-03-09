import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [isAuth, setIsAuth] = useState(() => !!localStorage.getItem('token'));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          isAuth ? <Navigate to="/profile" /> : <LoginPage setIsAuth={setIsAuth} />
        } />
        <Route path="/register" element={
          isAuth ? <Navigate to="/profile" /> : <RegisterPage setIsAuth={setIsAuth} />
        } />
        <Route 
        path="/profile" 
        element={
          isAuth ? 
          <ProfilePage setIsAuth={setIsAuth} /> :  // Показываем профиль
          <Navigate to="/login" replace />          // Или редирект на логин
        } 
      />
      </Routes>
    </BrowserRouter>
  );
}

export default App;