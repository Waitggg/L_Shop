import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage'; // ДОБАВЛЕНО: импорт главной страницы
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

function App() {
  const [isAuth, setIsAuth] = useState(() => !!localStorage.getItem('token'));

  return (
      <BrowserRouter>
        <Routes>
          {/* ДОБАВЛЕНО: Главная страница XenonZap теперь доступна по адресу / */}
          <Route path="/" element={<HomePage />} />

          <Route path="/cart" element={<CartPage></CartPage>}></Route>
          
          <Route path="/checkout" element={
            isAuth ? <CheckoutPage /> : <Navigate to="/login" />
          } />
          <Route path="/orders" element={
            isAuth ? <OrdersPage /> : <Navigate to="/login" />
          } />
          <Route path="/order-success/:orderId" element={
            isAuth ? <OrderSuccessPage /> : <Navigate to="/login" />
          } />
          
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