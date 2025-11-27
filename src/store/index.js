import { createStore } from 'vuex';
import movies from './modules/movies';
import bookings from './modules/bookings';
import favorites from './modules/favorites';

export default createStore({
    modules: {
        movies,
        bookings,
        favorites
    },

    // Enable strict mode in development (warns about state mutations outside of mutations)
    strict: import.meta.env.DEV
});
