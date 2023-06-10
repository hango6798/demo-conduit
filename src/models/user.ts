
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
    demo?: boolean;
    image: string;
    email?: string;
    id?: number;
}

export type Login = Pick<User, 'email' | 'password'>


export interface NewUser extends Pick<User, 'username' | 'email' | 'password'>{
    confirmPassword?: string;
}