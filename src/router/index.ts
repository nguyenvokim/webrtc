import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import WebRtc from '../views/WebRtc.vue';
import Dashboard from '@/views/Dashboard.vue';
import TestSlow from '@/views/TestSlow.vue';
import TestSlowAnother from '@/views/TestSlowAnother.vue';
import NonSlowAnother from '@/views/NonSlowAnother.vue';
import NonSlow from '@/views/NonSlow.vue';

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
    {
        path: '/slowFirst',
        name: 'SlowFirst',
        component: TestSlow,
    },
    {
        path: '/slowSecond',
        name: 'TestSlowAnother',
        component: TestSlowAnother,
    },
    {
        path: '/noneSlowFirst',
        name: 'noneSlowFirst',
        component: NonSlow,
    },
    {
        path: '/noneSlowSecond',
        name: 'noneSlowSecond',
        component: NonSlowAnother,
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
