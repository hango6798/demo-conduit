import { Login, NewUser, User } from "../models"
import axiosClient from "./axiosClient"

const userApi = {
    login(data: Login): Promise<User> {
        const url = '/users/login'
        return axiosClient.post(url, {user: {...data}})
    },
    register(data: NewUser): Promise<User> {
        const url = '/users'
        return axiosClient.post(url, {user: {...data}})
    },
    getCurrentUser(): Promise<User> {
        const url = '/user'
        return axiosClient.get(url)
    },
    updateUser(data: User): Promise<User> {
        const url = '/user'
        return axiosClient.put(url, {user: {...data}})
    }
}

export default userApi