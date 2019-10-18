import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import viewPlayGround from '../views/playground/index.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'view-playground',
    component: viewPlayGround,
  },
  {
    path: '/register',
    name: 'view-register',
    component: () => import('../views/register/index.vue'),
  },
  {
    path: '/login',
    name: 'view-login',
    component: () => import('../views/login/index.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
