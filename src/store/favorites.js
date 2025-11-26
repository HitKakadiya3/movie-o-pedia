import { defineStore } from "pinia";

export const useFavoritesStore = defineStore("favorites", {
    state: () => ({
        // Initialize from sessionStorage (persists until browser closes)
        favorites: JSON.parse(sessionStorage.getItem("favorites") || "[]")
    }),

    actions: {
        toggleFavorite(movie) {
            const exists = this.favorites.find(m => m.id === movie.id);
            if (exists) {
                this.favorites = this.favorites.filter(m => m.id !== movie.id);
            } else {
                this.favorites.push(movie);
            }

            // Save to sessionStorage (persists until browser closes)
            sessionStorage.setItem("favorites", JSON.stringify(this.favorites));
        }
    }
});
