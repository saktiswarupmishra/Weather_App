import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: () => import('../views/DashboardView.vue'),
    },
    {
        path: '/map',
        name: 'Map',
        component: () => import('../views/MapView.vue'),
    },
    {
        path: '/forecast',
        name: 'Forecast',
        component: () => import('../views/ForecastView.vue'),
    },
    {
        path: '/favorites',
        name: 'Favorites',
        component: () => import('../views/FavoritesView.vue'),
    },
    {
        path: '/alerts',
        name: 'Alerts',
        component: () => import('../views/AlertsView.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
