import { createRouter, createWebHistory } from 'vue-router'
import { HomePage } from '@/pages/home'
import { PlaylistPage } from '@/pages/playlist'
import AuthCallbackPage from '@/pages/auth-callback-page.vue'
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
            path: '/home',
            name: 'home-alternative',
            redirect: '/',
        },

        {
            path: '/playlists/:id',
            name: 'playlist',
            component: PlaylistPage,
        },

        {
            path: '/auth-callback',
            name: 'auth-callback',
            component: AuthCallbackPage,
        },

        {
            path: '/:pathMatch(.*)*',
            name: 'not-found-page',
            component: NotFoundPage,
        },
    ],
})

export default router
