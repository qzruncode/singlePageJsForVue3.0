module.exports = {
  ignorePatterns: ["node_modules", "config", "public", "dist", "env", "static", ".eslintrc.js"], // 忽略目录
  env: { // 不同的环境内置了一些全局变量
    browser: true, // dom相关的变量
    es2021: true, // es12相关的变量
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12, // 允许开启es12语法
    sourceType: 'module', // script 或者 module
    tsconfigRootDir: __dirname,
    project: `tsconfig.json`
  },
  extends: [
    "eslint:recommended",
    'plugin:@typescript-eslint/recommended',
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "consistent-return": 2,
    "indent": [1, 2],
    "no-else-return": 1,
    "semi": [1, "always"],
    "space-unary-ops": 2,
  },
  globals: {
    process: "readonly",
  },
  noInlineConfig: true, // 禁止在js文件中使用注释来配置eslint规则
};