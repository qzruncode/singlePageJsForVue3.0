import "core-js/stable";
import 'regenerator-runtime/runtime';
import { createApp } from 'vue';
import App from './app.vue';
import './index.less';
console.log(process.env.DB_HOST);
// 动态导入，webpack会自动分割代码
// import('./thrid').then(thrid => {
//     thrid.test();
// })
// 预请求
// prefetch 告诉浏览器此资源在未来的导航中用到。父块加载完了此块才开始加载，并且只会在浏览器空闲的时候下载，此块的代码是给未来用到的
// preload 告诉浏览器此资源在当前当行中用到。和父块并行加载，立即下载，此块的代码现在就要用到
// import(/* webpackPrefetch: true */ './path/to/LoginModal.js'); 

createApp(App).mount('#app');


