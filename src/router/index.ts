import Vue from 'vue';
import Router from 'vue-router';
// import Layout from '@/layout/index.vue';
Vue.use(Router);
export const constantRoutes = [
  {
    path: '/',
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('../layout/index.vue'),
        name: '首页',
        hidden: true,
        meta: { title: '首页' },
      },
    ],
  },

  {
    path: '/game',
    component: () => import('../game/index.vue'),
    name: '404',
    hidden: true,
    meta: { title: '404' },
  },
];


const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });
const router = createRouter();
Vue.router = router;

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;
