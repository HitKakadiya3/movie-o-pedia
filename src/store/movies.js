import { defineStore } from "pinia";

export const useMovieStore = defineStore("movies", {
    state: () => ({
        movies: [],
        selectedMovie: null,
        searchText: "",
        loading: false,
        error: null
    }),

    getters: {
        filteredMovies(state) {
            if (!state.searchText) return state.movies;

            return state.movies.filter(movie =>
                movie.title.toLowerCase().includes(state.searchText.toLowerCase())
            );
        }
    },

    actions: {
        async fetchMovies() {
            this.loading = true;
            this.error = null;

            try {
                const res = await fetch("http://localhost:5000/movies");

                if (!res.ok) throw new Error("Failed to fetch movies");

                const data = await res.json();
                this.movies = data;  // store list
            } catch (err) {
                this.error = "Unable to load movie list.";
                console.error(err);
            } finally {
                this.loading = false;
            }
        },

        setSearchText(text) {
            this.searchText = text;
        },

        getMovie(id) {
            // movie already fetched → find locally
            this.selectedMovie = this.movies.find(m => m.id == id);
        }
    }
});
