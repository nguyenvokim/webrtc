import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import WebRtc from '../views/WebRtc.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
    {
        path: '*',
        name: 'WebRtc',
        component: WebRtc,
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
