
export interface User {
    email: string;
    password?: string;
    username: string;
    bio: string;
    image: string;
    readonly token?: string;
}


export interface Author extends Omit<User, 'email' | 'password' | 'token'> {
    following: boolean
}

export type Login = Pick<User, 'email' | 'password'>


export interface NewUser extends Pick<User, 'username' | 'email' | 'password'>{
    confirmPassword?: string;
}