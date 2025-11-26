import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import MovieView from '../pages/MovieView.vue'
import Booking from '../pages/Booking.vue'
import BookingHistory from '../pages/BookingHistory.vue'
import NotFound from '../pages/NotFound.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        { path: "/movie/:id", name: "MovieView", component: MovieView },
        { path: "/booking/:id", name: "Booking", component: Booking },
        { path: "/bookings", name: "BookingHistory", component: BookingHistory },
        { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound }
        // Add more routes here
    ]
})

export default router
