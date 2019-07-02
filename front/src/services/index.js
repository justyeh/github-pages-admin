import http from "@/libs/http";
import { message } from "antd";

export const generate = async () => {
    try {
        let res = await http.get("/api/generate");
        if (res) {
            message.success("静态化成功");
        } else {
            throw new Error();
        }
    } catch (error) {
        message.error(`静态化成功失败${error ? " " + error : ""}`);
    }
};
