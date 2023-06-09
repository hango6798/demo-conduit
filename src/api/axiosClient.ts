import axios, { Axios } from "axios";
import { store } from "../store/store";
import { Store } from "@reduxjs/toolkit";


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
        const token = null
        // const {
            
        // } = store.getState();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (err) => Promise.reject(err)
);

export default axiosClient