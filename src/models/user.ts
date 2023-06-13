
export interface User {
    email: string;
    password?: string;
    username: string;
    bio: string;
    image: string;
    readonly token?: string;
}


export interface Author {
    following: boolean;
    username: string;
    bio: string;
    image: string;
}

export type Login = Pick<User, 'email' | 'password'>


export interface NewUser extends Pick<User, 'username' | 'email' | 'password'>{
    confirmPassword?: string;
}