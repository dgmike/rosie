import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboard from './Dashboard';
import Services from './Services';
import Service from './Service';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/dashboard' },
  { name: 'dashboard', path: '/dashboard', component: Dashboard },
  { name: 'services', path: '/servicos', component: Services },
  { name: 'service', path: '/servicos/:id', component: Service },
];

const router = new VueRouter({ routes });

export default router;
