import http from "@/libs/http";
import { message } from "antd";

export const getTagList = async keyword => {
    try {
        let res = await http.get("/api/tag/list", { params: { keyword } });
        if (res) {
            return res.data;
        } else {
            throw new Error();
        }
    } catch (error) {
        message.error(`获取Tag列表失败${error ? " " + error : ""}`);
        return [];
    }
};

export const updateTag = async (tagId, tagName) => {
    try {
        let res = await http.post("/api/tag/update", {
            id: tagId,
            name: tagName
        });
        if (res) {
            return true;
        } else {
            throw new Error();
        }
    } catch (error) {
        message.error(`更新Tag失败${error ? " " + error : ""}`);
    }
};

export const deleteTag = async tagId => {
    try {
        let res = await http.post("/api/tag/delete", { id: tagId });
        if (res) {
            return true;
        } else {
            throw new Error();
        }
    } catch (error) {
        message.error(`删除Tag失败${error ? " " + error : ""}`);
    }
};
