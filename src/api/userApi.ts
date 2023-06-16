import { Login, NewUser, User } from "@models"
import axiosClient from "./axiosClient"

const userApi = {
    login(data: Login): Promise<any> {
        const url = '/users/login'
        return axiosClient.post(url, {user: {...data}})
    },
    register(data: NewUser): Promise<any> {
        const url = '/users'
        return axiosClient.post(url, {user: {...data}})
    },
    getCurrentUser(): Promise<any> {
        const url = '/user'
        return axiosClient.get(url)
    },
    updateUser(data: User): Promise<any> {
        const url = '/user'
        return axiosClient.put(url, {user: {...data}})
    }
}

export default userApi