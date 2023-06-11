import axiosClient from "./axiosClient"

const profilesApi = {
    getProfile(username:string): Promise<any> {
        const url = `/profiles/${username}`
        return axiosClient.get(url)
    },
    follow(username:string): Promise<any> {
        const url = `/profiles/${username}/follow`
        return axiosClient.post(url)
    },
    unfollow(username:string): Promise<any> {
        const url = `/profiles/${username}/follow`
        return axiosClient.delete(url)
    }
}

export default profilesApi