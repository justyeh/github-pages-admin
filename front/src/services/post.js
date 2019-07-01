import http from "@/libs/http";
import { message } from "antd";

export const getPostList = async (status, keyword) => {
    try {
        let res = await http.get("/api/post/list", {
            params: {
                status,
                keyword
            }
        });
        if (res) {
            return res.data;
        } else {
            throw new Error();
        }
    } catch (error) {
        message.error(`获取Post列表失败${error ? " " + error : ""}`);
        return [];
    }
};

export const postDetail = async postId => {
    try {
        let res = await http.get("/api/post/detail", {
            params: { id: postId }
        });
        if (res) {
            return res;
        } else {
            throw new Error();
        }
    } catch (error) {
        message.error(`获取Post失败${error ? " " + error : ""}`);
    }
};

export const savePost = async post => {
    try {
        let res = await http.post("/api/post/save", { post });
        if (res) {
            return true;
        } else {
            throw new Error();
        }
    } catch (error) {
        message.error(
            `${post.id ? "更新" : "添加"}Post失败${error ? " " + error : ""}`
        );
    }
};

export const deletePost = async postId => {
    try {
    } catch (error) {
        message.error(`${error ? " " + error : ""}`);
    }

    try {
        let res = await http.post("/api/post/delete", { id: postId });
        if (res) {
            return true;
        } else {
            throw new Error();
        }
    } catch (error) {
        message.error("删除Post失败");
    }
};
