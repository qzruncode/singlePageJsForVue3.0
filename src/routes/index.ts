import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  { path: '/', component: () => import(/* webpackChunkName: "Home" */ '../components/home') },
  { path: '/about', component: () => import(/* webpackChunkName: "About" */ '../components/about') },
];

// 路由
export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() { // 滚动到顶部
    return { top: 0 };
  },
});