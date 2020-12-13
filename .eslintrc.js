module.exports = {
    "env": { // 不同的环境内置了一些全局变量
        "browser": true, // dom相关的变量
        "es2021": true, // es12相关的变量
    },
    "extends": [
        "eslint:recommended",
        'plugin:vue/vue3-recommended'
    ],
    "ignorePatterns": ["node_modules", "config", "public", "dist", "env", "static", ".eslintrc.js"], // 忽略目录
    "parserOptions": {
        "ecmaVersion": 12, // 允许开启es12语法
        "sourceType": "module", // script 或者 module
        "ecmaFeatures": { // 设置额外的特性
            "globalReturn": true, // 允许使用全局return
            "impliedStrict": true, // 开启全局严格模式（es6以上版本可用）
            "jsx": false, // 是否支持jsx语法
        }
    },
    "rules": {
        "consistent-return": 2,
        "indent": [1, 4],
        "no-else-return": 1,
        "semi": [1, "always"],
        "space-unary-ops": 2
    },
    "globals": {
        "process": "readonly",
    },
    "noInlineConfig": true, // 禁止在js文件中使用注释来配置eslint规则
};