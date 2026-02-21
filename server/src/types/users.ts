type Role = 'admin' | 'user' | 'guest';

interface IUser{
    id: String,
    email: String,
    password: String,
    creationDate: Date,
    role: Role
}

export class User implements IUser{
    constructor(
    public id: String,
    public email: String,
    public password: String,
    public creationDate: Date,
    public role: Role
    ) {}

    isAdmin() : boolean{
        return this.role == 'admin';
    }

    isGuest() : boolean{
        return this.role == 'guest';
    }
}