import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import WebRtc from '../views/WebRtc.vue';
import Dashboard from '@/views/Dashboard.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
    {
        path: '/web-rtc',
        name: 'WebRtc',
        component: WebRtc,
    },
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard,
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
