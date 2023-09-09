import axios from "axios";

import { API_URL } from "../../utils/constants/constants";

const VITE_API_KEY = import.meta.env.VITE_API_KEY;

const AwsApiClient = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

AwsApiClient.interceptors.request.use(
    (config) => {
        config.headers["X-API-Key"] = VITE_API_KEY ?? "";

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default AwsApiClient;
