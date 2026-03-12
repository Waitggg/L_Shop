import { generateToken } from '../services/token_generator';
import { getId } from '../services/user_getter';

type Role = 'admin' | 'user' | 'guest';

export interface AuthRequestBody {
  email: string;
  password: string;
}

export interface AuthResponseBody {
  status: number;
  success: boolean;
  token: string;
  message: string;
}

export interface ValidationResult {
  success: boolean;
  error: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

interface IUser{
    id?: string,
    email: string,
    password: string,
    creationDate?: Date,
    role?: Role,
    token?: string
}

export class User implements IUser{
    constructor(
    private _id: string,
    private _email: string,
    private _password: string,
    private _creationDate: Date,
    private _role: Role,
    private _token: string
    ) {}

    static async createNew(email: string, password: string, role: Role = 'user'): Promise<User> {
        // return new User(
        //     Date.now().toString(),
        //     email,
        //     password,
        //     new Date(),
        //     role,
        //     ''
        // );
        // new User(
        //       Date.now().toString(),
        //       req.body.email,
        //       req.body.password, // хэшировать потом надооооо!!!!
        //       new Date(),
        //       "user",
        //       await generateToken(req.body)
        //     );
        return new User(
              getId(),
              email,
              password, // хэшировать потом надооооо!!!!
              new Date(),
              role,
              await generateToken({email, password})
            );
    }


    get id(): string | undefined {
        return this._id;
    }

    get email(): string  {
        return this._email;
    }

    get password(): string {
        return this._password;
    }

    get creationDate(): Date | undefined {
        return this._creationDate;
    }

    get role(): Role | undefined {
        return this._role;
    }

    get token(): string | undefined {
        return this._token;
    }

    isAdmin() : boolean{
        return this._role == 'admin';
    }

    isGuest() : boolean{
        return this._role == 'guest';
    }
}