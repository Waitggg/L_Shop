import express, { Application, Request, Response} from 'express';
import path from 'path';
import { createUser } from './controllers/auth_controller';
import { User } from './types/users';

const app: Application = express();
const PORT = 3000;

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '/html/login.html'));
});

app.get('/index.css', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '/html/index.css'));
});

app.get('/api/products', (req: Request, res: Response) => {
  res.send({data: [{id: 1, title: "kbp"}]});
});

app.get('/api/user', (req: Request, res: Response) => {
  let newUser = createUser(new User("1", "52@gmail.com", "hash520", new Date(), "admin"));
  res.send({newUser});
});

app.listen(PORT, () => {
    console.log('enjebado');
});

// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');

// const crypto = require('crypto');
// const secret = "52";

// const charJson = path.join(__dirname, 'chars.json');
// const charData = JSON.parse(fs.readFileSync(charJson, 'utf8'));

// const PARTOFPATH =  path.join(__dirname, '/');

// const http = require('http');
// const WebSocket = require('ws');
// const port = process.env.PORT || 3000;

// const app = express();
// const server = http.createServer(app);

// app.post('/login', upload.none(), async (req, res) => {
//   try {

//   if(!req.body.token){
//       return res.status(200).send('Вы нето ввели!!!');
//     }

//     const token = req.body.token;

//     const filePath = path.join(`${PARTOFPATH}users.json`);
//     const rawData = fs.readFileSync(filePath, 'utf8');
//     const json = JSON.parse(rawData);
    
//     const user = json.users.find(u => u.token === token);
//     if(user)
//     {
//         res.status(200).json({ success: true, username: user.username });   

//     }
//     else
//     {
//         res.status(200).json({ success: false, message: "Такого пользователя нет!" });   
//     }

//     // fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
//     // res.status(200).send(`Персонаж "${name}" успешно удалён`);    
//   } catch (error) {
//     console.error('Ошибка при входе:', error);
//     res.status(500).json({ success: true, message: 'Ошибка при входе' });
//   }
// });

// app.post('/signup', upload.none(), async (req, res) => {
//   try {
//     if(!req.body.username || !req.body.password){
//       return res.status(200).json({ success: false , message: "Нето ввели чето!!"});
//     }

//     const username = req.body.username;
//     const password = req.body.password;

//     const filePath = path.join(`${PARTOFPATH}users.json`);
//     const rawData = fs.readFileSync(filePath, 'utf8');
//     const json = JSON.parse(rawData);
    
//     const user = json.users.find(u => u.username === username);

//     if(user)
//     {
//         return res.status(200).json({ success: false , message: "Такой пользователь уже есть!"});
//     }
//     else
//     {
//         const newChuvak = {
//           username: username,
//           password: password,
//           token: hs256(username+password, secret)
//         };
//         json.users.push(newChuvak);
//         fs.writeFileSync(`${PARTOFPATH}users.json`, JSON.stringify(json, null, 2), 'utf8');
//         return res.status(200).json({ success: true });
//     }

//   } catch (error) {
//     console.error('Ошибка регистрации:', error);
//     res.status(500).json({ success: false , message: "Ошибка при регистрации(сервер)"});
//   }
// });

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });

// app.get('/index.css', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.css'));
// });
