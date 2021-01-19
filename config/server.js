const net = require("net");
const webpack = require("webpack");
const webpackDevServer = require('webpack-dev-server');

const config = require("./dev.webpack.config.js");
const compiler = webpack(config);
let PORT = 3000;

// webpack 默认支持 json 和 js 处理
// 推荐使用babel处理js，可以用最新的js特性

const configServer = () => {
  const options = {
    quiet: true,
    progress: true,
    writeToDisk: true,
    contentBase: './dist',
    compress: true,
    hot: true,
    host: 'localhost',
    contentBase: './static', // 服务静态文件
    contentBasePublicPath: '/file', // 静态服务前缀
    proxy: {
      // "/api": 'https://target-ip:8080' // 代理 /api 请求 https://target-ip:8080/api
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: {'^/api' : ''} // 代理 /api 请求 https://target-ip:8080/
      }
    },
  };
  webpackDevServer.addDevServerEntrypoints(config, options);
  const server = new webpackDevServer(compiler, options);
  server.listen(PORT, function () {
    console.log(`project listening on port ${PORT}!\n`);
  });
}

// 起服务webpackDevServer
const checkPortIsValid = () => {
  const testServer = net.createServer().listen(PORT); // 检测端口有无重复
  testServer.on("listening", function () {
    testServer.close();
    // 端口可用
    configServer();
  });
  testServer.on("error", function (err) {
    if (err.code === "EADDRINUSE") {
      // 端口被占用
      PORT++;
      checkPortIsValid();
    }
  });
};
checkPortIsValid();
