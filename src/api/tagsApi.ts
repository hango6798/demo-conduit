import { Tags } from "../models"
import axiosClient from "./axiosClient"

const tagApi = {
    getAll():Promise<Tags> {
        const url = 'tags'
        return axiosClient.get(url)
    }
}

export default tagApi