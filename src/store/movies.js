import { defineStore } from "pinia";

export const useMovieStore = defineStore("movies", {
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

    actions: {
        async fetchMovies() {
            // If movies are already stored -> do not fetch
            if (this.movies.length > 0) return;

            this.globalLoading = true;

            try {
                const res = await fetch("http://localhost:5000/movies");

                if (!res.ok) throw new Error("Failed to fetch movies");

                const data = await res.json();

                this.movies = data;

                // Save to localStorage
                localStorage.setItem("movies", JSON.stringify(data));

            } catch (err) {
                this.error = "Unable to load movie list.";
                console.error(err);
            }

            this.globalLoading = false;
        },

        clearLocalMovies() {
            localStorage.removeItem("movies");
            this.movies = [];
        },

        setSearchText(text) {
            this.searchText = text;
        },

        getMovie(id) {
            this.selectedMovie = this.movies.find(m => m.id == id) || null;
        }
    }
});
