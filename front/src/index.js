import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "@/assets/less/common.less";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { message } from "antd";
import { Table, Modal } from "antd";
import { LocaleProvider } from "antd";
import zhCN from "antd/lib/locale-provider/zh_CN";

//全局配置组件属性

Modal.defaultProps.maskClosable = false;
Table.defaultProps = {
    size: "middle",
    pagination: false
};
//message全局配置
message.config({
    duration: 0.5,
    maxCount: 1
});

ReactDOM.render(
    <LocaleProvider locale={zhCN}>
        <App />
    </LocaleProvider>,
    document.getElementById("root")
);

serviceWorker.unregister();
