import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/login';
import ProjectPage from './views/project';
import Drive from './views/drive';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/myprojects',
      name: 'myprojects',
      component: ProjectPage
    },
    {
      path: '/myprojects/:projectName',
      name: 'myproject',
      component: Drive
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    // },
  ]
});
