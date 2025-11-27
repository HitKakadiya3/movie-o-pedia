<template>
  <div class="min-h-screen bg-gray-100 p-6">

    <!-- Back Button -->
    <div class="max-w-6xl mx-auto mb-4">
      <button
        @click="goBack"
        class="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow hover:bg-gray-50 transition"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
    </div>

    <!-- Movie Details Layout -->
    <div v-if="movieLoading" class="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md text-center">
      <p class="text-gray-600 text-lg">Loading movie details...</p>
    </div>

    <div v-else-if="!movie.id" class="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md text-center">
      <p class="text-gray-600 text-lg">Movie not found.</p>
    </div>

    <div v-else class="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">

      <!-- Top Section -->
      <div class="flex flex-col md:flex-row gap-8">

        <!-- Poster -->
        <div class="w-full md:w-1/3">
          <img
            :src="movie.poster"
            class="rounded-lg shadow-lg w-full object-cover"
          />
        </div>

        <!-- Info -->
        <div class="flex-1">
          <h1 class="text-3xl font-bold mb-2">{{ movie.title }}</h1>

          <!-- Genres -->
          <div class="mb-4">
            <span 
              v-for="(genre, index) in movie.genres?.split(', ')" 
              :key="index"
              class="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mr-2 mb-2"
            >
              {{ genre }}
            </span>
          </div>

          <div class="text-gray-600 mb-4">
            <p>⭐ Rating: {{ movie.rating }}</p>
            <p>⏳ Duration: {{ movie.duration }}</p>
          </div>

          <p class="text-gray-700 mb-6">
            {{ movie.description || "No description available." }}
          </p>

          <!-- Buttons -->
          <div class="flex gap-4">
            <button
              class="bg-purple-600 px-6 py-3 text-white font-semibold rounded-lg hover:bg-purple-700"
              @click="book"
            >
              Book Tickets
            </button>

            <button
              @click="toggleFav"
              class="border px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
            >
              {{ isFav ? "★ Remove Favorite" : "☆ Add to Favorites" }}
            </button>
          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

// Router
const route = useRoute();
const router = useRouter();

// Stores
const store = useStore();
const movieLoading = computed(() => store.state.movies.loading);

// Fetch movies if not already loaded, then get the specific movie
onMounted(async () => {
  // If movies not loaded -> fetch
  if (store.state.movies.movies.length === 0) {
    await store.dispatch('movies/fetchMovies');
  }

  store.dispatch('movies/getMovie', route.params.id);

  if (!store.state.movies.selectedMovie) {
    router.push("/404");
  }
});

// Make movie reactive - it will update when selectedMovie changes
const movie = computed(() => store.state.movies.selectedMovie || {});

// Check if favorite
const isFav = computed(() =>
  store.getters['favorites/isFavorite'](movie.value.id)
);

const toggleFav = () => store.dispatch('favorites/toggleFavorite', movie.value);

// Go to booking page
const book = () => {
  router.push(`/booking/${movie.value.id}`);
};

// Go back to previous page
const goBack = () => {
  router.back();
};
</script>
