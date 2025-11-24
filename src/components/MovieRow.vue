<template>
  <div class="mb-10 px-6">
    <h2 class="text-xl font-bold mb-3">{{ title }}</h2>

    <div class="flex space-x-4 overflow-x-scroll scrollbar-hide pb-4">
      <div
        v-for="movie in list"
        :key="movie.id"
        class="min-w-[180px] relative movie-item"
        @click="openMovie(movie.id)"
      >
        <img
          :src="movie.poster"
          class="w-full h-40 object-cover rounded-lg hover:scale-105 transition duration-300"
        />

        <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition rounded-lg flex items-center justify-center">
          <button class="bg-white text-black px-3 py-1 text-sm rounded">
            View
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  title: String,
  list: Array,
});

const router = useRouter();

const openMovie = (id) => {
  router.push(`/movie/${id}`);
};
</script>

<style>
/* Hide scrollbar */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
