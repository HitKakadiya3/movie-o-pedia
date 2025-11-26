import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../pages/Home.vue')
        },
        { path: "/movie/:id", name: "MovieView", component: () => import('../pages/MovieView.vue') },
        { path: "/booking/:id", name: "Booking", component: () => import('../pages/Booking.vue') },
        { path: "/bookings", name: "BookingHistory", component: () => import('../pages/BookingHistory.vue') },
        { path: "/:pathMatch(.*)*", name: "NotFound", component: () => import('../pages/NotFound.vue') }
        // Add more routes here
    ]
})

export default router
