import axios, { Axios } from "axios";
import { store } from "../store";

const axiosClient = axios.create({
    baseURL: 'https://conduit.productionready.io/api',
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
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (err) => Promise.reject(err)
);

export default axiosClient