import axios from "axios";
import { store } from "store/store";
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
        const user = currentStore.userReducer.user
        config.headers.Authorization = user ? `Bearer ${user.token}` : undefined;
        return config;
    },
    (err) => Promise.reject(err)
);

export default axiosClient