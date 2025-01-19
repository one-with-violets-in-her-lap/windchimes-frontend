import { createRouter, createWebHistory } from 'vue-router'

import AuthCallbackPage from '@/pages/auth-callback-page.vue'
import { HomePage } from '@/pages/home'
import NotFoundPage from '@/pages/not-found-page.vue'
import { PlaylistPage } from '@/pages/playlist'

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
