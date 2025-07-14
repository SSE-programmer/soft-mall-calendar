import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'calendar',
            component: () => import('../views/CalendarView.vue')
        },
        {
            path: '/description',
            name: 'description',
            component: () => import('../views/DescriptionView.vue'),
        },
    ],
});

export default router;
