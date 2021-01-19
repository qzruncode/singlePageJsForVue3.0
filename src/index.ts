import "core-js/stable";
import 'regenerator-runtime/runtime';
import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import App from './app';
import routes from './routes';
import { stores, key } from './store';
import './index.less';
console.log(process.env.DB_HOST);

createApp(App).use(ElementPlus).use(routes).use(stores, key).mount('#app');
