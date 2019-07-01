const {
    override,
    fixBabelImports,
    addWebpackAlias,
    addLessLoader
} = require("customize-cra");
const path = require("path");

process.env.GENERATE_SOURCEMAP = "false";

let config = override(
    //按需加载antd
    fixBabelImports("import", {
        libraryName: "antd",
        libraryDirectory: "es",
        style: true
    }),
    // 配置路径别名
    addWebpackAlias({
        "@": path.resolve(__dirname, "./src")
    }),
    //antd自定义主题+less配置
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {
            "@primary-color": "#1b8afa",
        }
    })
);


module.exports = config;
