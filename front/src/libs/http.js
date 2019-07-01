import axios from "axios";
import { storage } from "@/libs/utils";
import { message } from "antd";

const http = axios.create({
    timeout: 5000,
    baseURL: "/"
});

//request拦截器
http.interceptors.request.use(
    config => {
        config.headers["authorization"] = storage.get("token") || "";
        config.headers["X-Requested-With"] = "XMLHttpRequest";
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

//response拦截器
http.interceptors.response.use(
    response => {
        if (response.data.code === 200) {
            return response.data;
        } else {
            return Promise.reject(JSON.stringify(response.data.message));
        }
    },
    error => {
        console.log(error);
        message.error("网络错误，请稍后再试！");
        return false;
    }
);

export default http;
