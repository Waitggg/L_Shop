// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import ProfilePage from './pages/ProfilePage';

// function App() {
//   const [isAuth, setIsAuth] = useState<boolean>(() => {
//     // Проверяем при загрузке, есть ли токен
//     return !!localStorage.getItem('token');
//   });

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Публичные маршруты */}
//         <Route 
//           path="/login" 
//           element={
//             isAuth ? 
//             <Navigate to="/profile" replace /> : 
//             <LoginPage setIsAuth={setIsAuth} />
//           } 
//         />
        
//         <Route 
//           path="/register" 
//           element={
//             isAuth ? 
//             <Navigate to="/profile" replace /> : 
//             <RegisterPage setIsAuth={setIsAuth} />
//           } 
//         />
        
//         {/* Защищенные маршруты */}
//         <Route 
//           path="/profile" 
//           element={
//             isAuth ? 
//             <ProfilePage setIsAuth={setIsAuth} /> : 
//             <Navigate to="/login" replace />
//           } 
//         />
        
//         {/* Редирект с главной */}
//         <Route 
//           path="/" 
//           element={<Navigate to={isAuth ? "/profile" : "/login"} replace />} 
//         />
        
//         {/* 404 */}
//         <Route 
//           path="*" 
//           element={<Navigate to="/" replace />} 
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

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