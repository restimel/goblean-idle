import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    }, {
        path: '/menu',
        name: 'Menu',
        component: () => import(/* webpackChunkName: "menu" */ '../views/Menu.vue'),
    }, {
        path: '/map',
        name: 'Map',
        component: () => import(/* webpackChunkName: "map" */ '../views/Map.vue'),
    }, {
        path: '/achievement',
        name: 'Achievement',
        component: () => import(/* webpackChunkName: "achievement" */ '../views/Achievement.vue'),
    }, {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
