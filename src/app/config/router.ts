import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/home-page.vue'
import SearchPage from '@/pages/search-page.vue'
import NotFoundPage from '@/pages/not-found-page.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage,
        },

        {
            path: '/search',
            name: 'search',
            component: SearchPage,
        },

        {
            path: '/:pathMatch(.*)*',
            component: NotFoundPage,
        },
    ],
})

export default router
