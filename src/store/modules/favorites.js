// Vuex module for favorites
export default {
    namespaced: true,

    state: () => ({
        // Initialize from sessionStorage (persists until browser closes)
        favorites: JSON.parse(sessionStorage.getItem("favorites") || "[]")
    }),

    getters: {
        isFavorite: (state) => (movieId) => {
            return state.favorites.some(m => m.id === movieId);
        }
    },

    mutations: {
        ADD_FAVORITE(state, movie) {
            state.favorites.push(movie);
        },

        REMOVE_FAVORITE(state, movieId) {
            state.favorites = state.favorites.filter(m => m.id !== movieId);
        },

        SET_FAVORITES(state, favorites) {
            state.favorites = favorites;
        }
    },

    actions: {
        toggleFavorite({ commit, state }, movie) {
            const exists = state.favorites.find(m => m.id === movie.id);
            if (exists) {
                commit('REMOVE_FAVORITE', movie.id);
            } else {
                commit('ADD_FAVORITE', movie);
            }

            // Save to sessionStorage (persists until browser closes)
            sessionStorage.setItem("favorites", JSON.stringify(state.favorites));
        },

        loadFavorites({ commit }) {
            const favorites = JSON.parse(sessionStorage.getItem("favorites") || "[]");
            commit('SET_FAVORITES', favorites);
        }
    }
};
