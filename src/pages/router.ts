import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'calendar',
            component: () => import('@/pages/calendar-view/calendar-view.vue')
        },
        {
            path: '/description',
            name: 'description',
            component: () => import('@/pages/description-view/description-view.vue'),
        },
    ],
});

export default router;
