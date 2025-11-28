<template>
  <div class="p-6">

    <div class="flex flex-col md:flex-row gap-10">
      <!-- Poster -->
      <div class="w-full md:w-1/3 rounded-xl overflow-hidden shadow-lg">
        <img
          :src="movie.poster"
          class="w-full object-cover"
        />
      </div>

      <!-- Movie Info -->
      <div class="flex-1">
        <h1 class="text-3xl font-bold mb-2">{{ movie.title }}</h1>

        <p class="text-gray-600 mb-6">
          {{ movie.duration }} • ⭐ {{ movie.rating }}/5
        </p>

        <button
          class="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
          @click="book"
        >
          Book Tickets
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMoviesStore } from "../store/movies";
import { storeToRefs } from "pinia";

const route = useRoute();
const router = useRouter();
const moviesStore = useMoviesStore();

moviesStore.getMovie(route.params.id);
const { selectedMovie } = storeToRefs(moviesStore);
const movie = computed(() => selectedMovie.value || {});

const book = () => router.push(`/booking/${movie.value.id}`);
</script>
