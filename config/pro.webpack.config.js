const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require('dotenv-webpack');
const { VueLoaderPlugin } = require('vue-loader');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const babelLoaderConf = {
  loader: "babel-loader",
  options: {
    presets: [["@babel/preset-env", { useBuiltIns: "usage", corejs: "3", debug: true }]],
    plugins: [
      [
        "@babel/plugin-transform-runtime",
        {
          corejs: { version: 3, proposals: true },
        },
      ],
      ["@vue/babel-plugin-jsx"]
    ],
    cacheDirectory: true, // babel编译后的内容默认缓存在 node_modules/.cache/babel-loader
  },
};

const publicPath = "/";
module.exports = {
  stats: "errors-warnings", // 只有错误或者警告的时候才输出信息
  context: path.resolve(__dirname, '../'),
  mode: "production", // 自带 tree shaking
  entry: {
    index: {
      import: ["/src/index.ts"],
      dependOn: "shared", // 多入口重复导入代码的分割
    },
    common: {
      import: ["/src/common.js"],
      dependOn: "shared",
    },
    shared: "lodash", // 指出那些在多入口中重复import代码需要共用，提取到shared.js中
  },
  performance: {
    hints: "warning", // 发出警告，默认最大值是250kb
    maxAssetSize: 4000000, // 文件size最大值
    maxEntrypointSize: 4000000, // 入口size最大值
    assetFilter: function (assetFilename) {
      // 过滤出需要计算大小的文件
      return assetFilename.endsWith(".css") || assetFilename.endsWith(".js");
    },
  },
  optimization: {
    moduleIds: "deterministic", // 替换自增的module.id，保证vendors.js的id更改，使用此配置 filename 的 contenthash 缓存功能才会生效
    runtimeChunk: "single", // 单页面的多入口文件代码分割必须加此配置，将多入口的runtime文件放在一起
    // 在package.json文件中添加 "sideEffects": false 表示webpack可以移除所有 dead code
    /**
     * 必须将css文件排除，否则将会移除所有css文件
        "sideEffects": [
            "./src/some-side-effectful-file.js",
            "*.css"
        ]
    */
    splitChunks: {
      /**
          async 异步加载导入的模块 import('module').then()
          initial 直接import导入的模块
          all 包含上述两种情况
       */
      chunks: "all",
      maxAsyncRequests: 30, // 按需加载最大并行请求
      maxInitialRequests: 30, // 每个入口点最大的并行请求
      minSize: 20000, // 生成chunk最小的大小
      enforceSizeThreshold: 50000, // 当chunk的大小超过此值将强制拆分
      cacheGroups: {
        // 提取第三方库文件
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module, chunks, cacheGroupKey) { // 给提取的文件取名
            // module.identifier() 原始文件的路径
            // cacheGroupKey 当前cacheGroups的组名
            const moduleFileName = module.identifier().split('/').reduceRight(item => item); // 获取原始文件的文件名
            const allChunksNames = chunks.map((item) => item.name).join('~');
            return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
          },
          chunks: "all",
        },
      },
    },
  },
  resolve: {
    extensions: ['.ts', ".tsx", '.js'],
    modules: [ // 设置解析模块时要查找的路径
      "node_modules",
      path.resolve(__dirname, '../', 'src')
    ],
    alias: {
      "@": path.resolve(__dirname, '../', 'src'),
    },
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "js/[name].[contenthash].js", // 当内容发生改变 contenthash 就会变，必须将runtime代码提取出来才会生效
    publicPath: publicPath,
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.txt$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024, // 超过4kb会生成文件
          },
        },
      },
      {
        test: /\.l?[ec]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader, // 将 css 生成独立的文件
            options: { publicPath: publicPath },
          },
          "css-loader",
          {
            // npm install --save-dev postcss-loader postcss postcss-preset-env
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                // postcss-preset-env 内部集成了 autoprefixer 添加css第三方前缀
                // https://github.com/postcss/autoprefixer
                plugins: ["postcss-preset-env"],
              },
            },
          },
          "less-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          // 文件生成到 image 目录下
          filename: "image/[hash][ext][query]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          // 文件生成到 font 目录下
          filename: "font/[hash][ext][query]",
        },
      },
      {
        test: /\.tsx?$/,
        use: [
          babelLoaderConf,
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              appendTsSuffixTo: [/\.vue$/]
            }
          }
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|config|public|dist|env|static)/,
        use: [babelLoaderConf],
      },

    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "static", to: "static" },
      ],
    }), // 复制文件或者文件夹
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
    new CleanWebpackPlugin(), // 清空dist目录
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].css",
      chunkFilename: "css/[id].[contenthash].css",
    }), // 将js文件中import的css文件提取到单独的css文件中
    new Dotenv(),
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        files: './src/**/*.{tsx,ts,js}' // 支持eslint检测
      }
    }),
    new VueLoaderPlugin(),
  ],
};
