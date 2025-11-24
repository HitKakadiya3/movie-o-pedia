import { defineStore } from "pinia";

export const useFavoritesStore = defineStore("favorites", {
    state: () => ({
        favorites: []
    }),

    actions: {
        toggleFavorite(movie) {
            const exists = this.favorites.find(m => m.id === movie.id);
            if (exists) {
                this.favorites = this.favorites.filter(m => m.id !== movie.id);
            } else {
                this.favorites.push(movie);
            }
        }
    }
});
