import axios from "axios";
import { store } from "../store/store";

const axiosClient = axios.create({
    baseURL: "https://api.realworld.io/api",
    headers: {
        "Content-Type": 'application/json',
    }
})

axiosClient.interceptors.request.use(
    (config) => {
        // get token from store
        const currentStore = store.getState()
        const token = currentStore.userReducer.token
        if (token) {
            config.headers.Authorization = token ? `Bearer ${token}` : undefined;
        }
        return config;
    },
    (err) => Promise.reject(err)
);

export default axiosClient