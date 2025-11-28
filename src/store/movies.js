import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMoviesStore = defineStore('movies', () => {
    // State
    const movies = ref(JSON.parse(localStorage.getItem("movies") || "[]"));
    const selectedMovie = ref(null);
    const searchText = ref("");
    const loading = ref(false);
    const error = ref(null);
    const globalLoading = ref(false);

    // Getters
    const filteredMovies = computed(() => {
        if (!searchText.value) return movies.value;
        return movies.value.filter(movie =>
            movie.title.toLowerCase().includes(searchText.value.toLowerCase())
        );
    });

    // Actions
    async function fetchMovies() {
        // If movies are already stored -> do not fetch
        if (movies.value.length > 0) return;

        globalLoading.value = true;

        try {
            const res = await fetch("http://localhost:5000/movies");

            if (!res.ok) throw new Error("Failed to fetch movies");

            const data = await res.json();

            movies.value = data;

            // Save to localStorage
            localStorage.setItem("movies", JSON.stringify(data));

        } catch (err) {
            error.value = "Unable to load movie list.";
            console.error(err);
        } finally {
            globalLoading.value = false;
        }
    }

    function clearLocalMovies() {
        localStorage.removeItem("movies");
        movies.value = [];
    }

    function setSearchText(text) {
        searchText.value = text;
    }

    function getMovie(id) {
        const movie = movies.value.find(m => m.id == id) || null;
        selectedMovie.value = movie;
    }

    return {
        movies,
        selectedMovie,
        searchText,
        loading,
        error,
        globalLoading,
        filteredMovies,
        fetchMovies,
        clearLocalMovies,
        setSearchText,
        getMovie
    };
});
