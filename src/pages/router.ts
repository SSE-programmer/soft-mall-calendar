import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'calendar',
            component: () => import('@/pages/calendar-view/CalendarView.vue')
        },
        {
            path: '/description',
            name: 'description',
            component: () => import('@/pages/description-view/DescriptionView.vue'),
        },
    ],
});

export default router;
