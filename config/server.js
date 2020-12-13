const express = require("express");
const net = require("net");
const { createProxyMiddleware } = require("http-proxy-middleware");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const app = express();
const config = require("./dev.webpack.config.js");
const compiler = webpack(config);
let PORT = 3000;

// proxy代理
app.use(
    "/api",
    createProxyMiddleware({
        target: "https://target-ip:8080",
        pathRewrite: { "^/api": "" },
        secure: false,
    })
);

// webpack 默认支持 json 和 js 处理
// 推荐使用babel处理js，可以用最新的js特性

app.use(
    webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        writeToDisk: false, // 文件是否保存在内存
    })
);

app.use(
    webpackHotMiddleware(compiler, {
        log: false,
        path: "/__yejiawei", // 必须和客户端设置的path一致
        heartbeat: 5000, // 检查和客户端是否保持连接的时间间隔，必须比客户端设置的timeout小，一般为一半
    })
);

// 起服务
const checkPortIsValid = () => {
    const server = net.createServer().listen(PORT);
    server.on("listening", function () {
        server.close();
        // 端口可用
        app.listen(PORT, function () {
            console.log(`project listening on port ${PORT}!\n`);
        });
    });
    server.on("error", function (err) {
        if (err.code === "EADDRINUSE") {
            // 端口被占用
            PORT++;
            checkPortIsValid();
        }
    });
};
checkPortIsValid();