import axios from "axios";
import { API_URL } from "../../utils/constants/constants";

const VITE_API_KEY = import.meta.env.VITE_API_KEY;

const http = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

// Change request data/error here
http.interceptors.request.use(
    (config) => {
        config.headers["X-API-Key"] = VITE_API_KEY ?? "";

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default http;
