import { hs256 } from './userHash.js';
console.log(hs256('52'));
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded');
    const loginSubmit = document.getElementById('loginSubmit');
    if (loginSubmit) {
        loginSubmit.addEventListener('click', async () => {
            const password = document.getElementById('loginPassword')?.value || '';
            try {
                const hashedPassword = await hs256(password);
                console.log('Password hashed successfully');
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: hashedPassword })
                });
                const data = await response.json();
                console.log('Login response:', data);
            }
            catch (error) {
                console.error('Error:', error);
            }
        });
    }
});
// const errorDiv = document.getElementById('loginError');
// let currentUserToken = '';
// const switchEl = document.querySelector('.auth-switch');
// const buttons = document.querySelectorAll('.auth-switch-btn');
// const loginForm = document.getElementById('loginForm');
// const signupForm = document.getElementById('signupForm');
// function showAuthModal() {
//         if(currentUserToken)
//         {
//             return;
//         }
//         const shadowing = document.createElement('div');
//         shadowing.classList.add('shadowing');
//         shadowing.id = 'authShadowing';
//         const authContainer = document.createElement('div');
//         authContainer.classList.add('authContainer');
//         authContainer.id = 'authContainer';
//         authContainer.innerHTML = `
//             <div class="auth-switch" data-active="left">
//             <button class="auth-switch-btn" data-side="left">Авторизация</button>
//             <button class="auth-switch-btn" data-side="right">Регистрация</button>
//            </div>            
//             <div class="auth-content">
//                 <div id="loginForm" class="auth-form active">
//                     <h3>Авторизация</h3>
//                     <input type="text" id="loginUsername" class="auth-input" placeholder="Логин">
//                     <input type="password" id="loginPassword" class="auth-input" placeholder="Пароль">
//                     <button id="loginSubmit" class="auth-submit">Войти</button>
//                     <div id="loginError" class="auth-error"></div>
//                 </div>
//                 <div id="signupForm" class="auth-form">
//                     <h3>Регистрация</h3>
//                     <input type="text" id="signupUsername" class="auth-input" placeholder="Логин">
//                     <input type="password" id="signupPassword" class="auth-input" placeholder="Пароль">
//                     <button id="signupSubmit" class="auth-submit">Зарегистрироваться</button>
//                     <div id="signupError" class="auth-error"></div>
//                 </div>
//             </div>
//             <button id="authSkip" class="auth-skip">Пропустить</button>
//         `;
//         document.body.appendChild(shadowing);
//         document.body.appendChild(authContainer);
//        const switchEl = document.querySelector('.auth-switch');
//         const buttons = document.querySelectorAll('.auth-switch-btn');
//         const loginForm = document.getElementById('loginForm');
//         const signupForm = document.getElementById('signupForm');
//         function updateForms() {
//           const active = switchEl.dataset.active;
//           const isLeft = active === 'left';
//           // Показываем/скрываем формы
//           loginForm.classList.toggle('active', isLeft);
//           signupForm.classList.toggle('active', !isLeft);
//           // Также обновляем заголовки если нужно
//           const loginTitle = loginForm.querySelector('h3');
//           const signupTitle = signupForm.querySelector('h3');
//           if (isLeft) {
//             loginTitle.textContent = 'Авторизация';
//             signupTitle.textContent = 'Регистрация';
//           } else {
//             loginTitle.textContent = 'Вход';
//             signupTitle.textContent = 'Создать аккаунт';
//           }
//         }
//         buttons.forEach(btn => {
//           btn.addEventListener('click', () => {
//             const side = btn.dataset.side;
//             switchEl.dataset.active = side;
//             updateForms();
//           });
//         });
//         updateForms();
//         document.getElementById('loginSubmit').addEventListener('click', function() {
//             const username = document.getElementById('loginUsername').value.trim();
//             const password = document.getElementById('loginPassword').value.trim();
//             const errorDiv = document.getElementById('loginError');
//             if (!username || !password) {
//                 errorDiv.textContent = 'Заполните все поля';
//                 return;
//             }
//             else { errorDiv.textContent = '';}
//             hs256(username + password, secret).then(token => {
//             currentUserToken = token;
//             const formData = new FormData();
//             formData.append("token", currentUserToken);
//             fetch('/login', {
//                 method: 'POST',
//                 body: formData
//             })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.success) {
//                     localStorage.setItem('token', currentUserToken);
//                     closeAuthModal();
//                     if (document.querySelector('.user-name')) {
//                         document.querySelector('.user-name').textContent = username;
//                     }
//                     // currentUserToken = await hs256(username+password, secret);
//                     const formData = new FormData();
//                     formData.append('token', currentUserToken);
//                     fetch('/chars', {
//                       method: 'POST',
//                       body: formData
//                     }).then(response => response.json())
//             .       then(data => {
//                     if (data.success) {
//                         charData = data.data;
//                         // charData.sort((a, b) => a.id - b.id);
//                         charData.forEach((char, index) => {
//                           char.id = index + 1;
//                         });
//                         errorDiv.textContent = 'Все ок.';
//                     } else {
//                         alert(data.message || 'Ошибка получения бойцов');
//                         errorDiv.textContent = data.message || 'Ошибка получения бойцов';
//                     }
//                     updateAuthButtons();
//             })
//             .catch(error => {
//                 console.log(error);
//                 errorDiv.textContent = 'Ошибка соединения';
//             });
//                     }
//                     else { errorDiv.textContent = 'Ошибка авторизации!\n Введите корректные логин и пароль!';
//                     currentUserToken = '';
//                             return;}});
//             })
//             .catch(error => {
//                 errorDiv.textContent = 'Ошибка соединения';
//             });
//         });
//         document.getElementById('signupSubmit').addEventListener('click', function() {
//             const username = document.getElementById('signupUsername').value.trim();
//             const password = document.getElementById('signupPassword').value.trim();
//             const errorDiv = document.getElementById('signupError');
//             if (!username || !password) {
//                 errorDiv.textContent = 'Заполните все поля';
//                 return;
//             }
//             else { errorDiv.textContent = '';}
//             const formData = new FormData();
//             formData.append("username", username);
//             formData.append("password", password); 
//             fetch('/signup', {
//                 method: 'POST',
//                 body: formData
//             })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.success) {
//                     errorDiv.textContent = 'Регистрация успешна! Теперь войдите.';
//                     // tabs[0].click();
//                 } else {
//                     errorDiv.textContent = data.message || 'Ошибка регистрации';
//                 }
//             })
//             .catch(error => {
//                 console.log(error);
//                 errorDiv.textContent = 'Ошибка соединения';
//             });
//         });
//         document.getElementById('authSkip').addEventListener('click', function() {
//             closeAuthModal();
//         });
//         function closeAuthModal() {
//             document.body.removeChild(shadowing);
//             document.body.removeChild(authContainer);
//         }
//     }
