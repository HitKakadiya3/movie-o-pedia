import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import MovieView from '../pages/MovieView.vue'
import Booking from '../pages/Booking.vue'

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
        // Add more routes here
    ]
})

export default router
