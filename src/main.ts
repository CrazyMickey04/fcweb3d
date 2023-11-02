import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import '../src/assets/styles/index.css';
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/layout/index.vue'),
          name: '首页',
          hidden: true,
          meta: { title: '首页' },
        },
      ],
    },
  
    {
      path: '/game',
      component: () => import('@/game/index.vue'),
      name: '404',
      hidden: true,
      meta: { title: '404' },
    },
  ],
});
const app = createApp(App);
app.use(router);
app.mount('#app');

(function(doc, win){
  const fn = () => {
    const docEl = doc.documentElement,
      clientWidth = docEl.clientWidth;
    if (!clientWidth) return;
    docEl.style.fontSize = 100 * (clientWidth / 1920) + 'px';
  };
  if (!doc.addEventListener) return;
  win.addEventListener('resize', fn);
  doc.addEventListener('DOMContentLoaded', fn);
})(document, window);
