import fs from 'fs';
import path from 'path';
import { AuthResponseBody, User } from '../types/users';
import { generateToken } from '../services/token_generator';

export async function createUser(user:User)
{
    const email = user.email;
    const password = user.password;

    const filePath = path.resolve(__dirname, '../db/users.json');
    const rawData = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(rawData);
    
    const findedUser = json.users.find((u: User) => u.email === email);
    if (findedUser) return { status: 400, success: false, message: 'Email уже существует' };
    else
    {
        const newChuvak = {
          id: user.id,
          email: email,
          password: password,
          creationDate: user.creationDate,
          role: "user",
          token: user.token
        };
        json.users.push(newChuvak);
        fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
        return { status: 201, success: true, message: 'Пользователь создан', data: { userId: newChuvak.id, token: newChuvak.token } };
    }
}

export async function authUser(user:User) : Promise<AuthResponseBody>
{
    const token = await generateToken(user);
    const filePath = path.resolve(__dirname, '../db/users.json');
    const rawData = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(rawData);
    
    const findedUser = json.users.find((u: User) => u.token === token);
    if (findedUser) return { status: 200, success: true, token: `${token}`, message: 'Вы удачно вошли в аккаунт!' };
    return { status: 400, success: false, token: "", message: 'Пользователь не найден!' };
}