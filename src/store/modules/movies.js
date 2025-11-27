// Vuex module for movies
export default {
    namespaced: true,

    state: () => ({
        movies: JSON.parse(localStorage.getItem("movies") || "[]"),
        selectedMovie: null,
        searchText: "",
        loading: false,
        error: null,
        globalLoading: false
    }),

    getters: {
        filteredMovies(state) {
            if (!state.searchText) return state.movies;

            return state.movies.filter(movie =>
                movie.title.toLowerCase().includes(state.searchText.toLowerCase())
            );
        }
    },

    mutations: {
        SET_MOVIES(state, movies) {
            state.movies = movies;
        },

        SET_SELECTED_MOVIE(state, movie) {
            state.selectedMovie = movie;
        },

        SET_SEARCH_TEXT(state, text) {
            state.searchText = text;
        },

        SET_LOADING(state, loading) {
            state.loading = loading;
        },

        SET_ERROR(state, error) {
            state.error = error;
        },

        SET_GLOBAL_LOADING(state, loading) {
            state.globalLoading = loading;
        },

        CLEAR_MOVIES(state) {
            state.movies = [];
        }
    },

    actions: {
        async fetchMovies({ commit, state }) {
            // If movies are already stored -> do not fetch
            if (state.movies.length > 0) return;

            commit('SET_GLOBAL_LOADING', true);

            try {
                const res = await fetch("http://localhost:5000/movies");

                if (!res.ok) throw new Error("Failed to fetch movies");

                const data = await res.json();

                commit('SET_MOVIES', data);

                // Save to localStorage
                localStorage.setItem("movies", JSON.stringify(data));

            } catch (err) {
                commit('SET_ERROR', "Unable to load movie list.");
                console.error(err);
            }

            commit('SET_GLOBAL_LOADING', false);
        },

        clearLocalMovies({ commit }) {
            localStorage.removeItem("movies");
            commit('CLEAR_MOVIES');
        },

        setSearchText({ commit }, text) {
            commit('SET_SEARCH_TEXT', text);
        },

        getMovie({ commit, state }, id) {
            const movie = state.movies.find(m => m.id == id) || null;
            commit('SET_SELECTED_MOVIE', movie);
        }
    }
};
