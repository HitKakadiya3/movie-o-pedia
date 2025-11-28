import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFavoritesStore = defineStore('favorites', () => {
    // State
    const favorites = ref(JSON.parse(sessionStorage.getItem("favorites") || "[]"));

    // Getters
    function isFavorite(movieId) {
        return favorites.value.some(m => m.id === movieId);
    }

    // Actions
    function toggleFavorite(movie) {
        const exists = favorites.value.find(m => m.id === movie.id);
        if (exists) {
            favorites.value = favorites.value.filter(m => m.id !== movie.id);
        } else {
            favorites.value.push(movie);
        }
        sessionStorage.setItem("favorites", JSON.stringify(favorites.value));
    }

    function loadFavorites() {
        favorites.value = JSON.parse(sessionStorage.getItem("favorites") || "[]");
    }

    return {
        favorites,
        isFavorite,
        toggleFavorite,
        loadFavorites
    };
});
