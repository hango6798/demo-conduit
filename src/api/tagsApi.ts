import axiosClient from "./axiosClient"

const tagApi = {
    getAll():Promise<any> {
        const url = 'tags'
        return axiosClient.get(url)
    }
}

export default tagApi