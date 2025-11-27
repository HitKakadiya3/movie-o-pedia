<template>
  <div class="cursor-pointer relative" @click="openDetails">

    <!-- Favorite Star Badge -->
    <div
      v-if="isFavorite"
      class="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded shadow z-1"
    >
      ⭐ Favorite
    </div>

    <!-- Poster -->
    <div class="rounded-lg overflow-hidden shadow hover:scale-105 transition">
      <img
        :src="movie.poster"
        class="w-full h-64 object-cover"
      />
    </div>

    <!-- Title -->
    <h3 class="font-semibold mt-2 text-sm">{{ movie.title }}</h3>
    <p class="text-gray-600 text-xs">{{ movie.duration }}</p>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const props = defineProps({
  movie: Object,
});

const router = useRouter();
const store = useStore();

// Check if movie is in favorites
const isFavorite = computed(() =>
  store.getters['favorites/isFavorite'](props.movie.id)
);

const openDetails = () => {
  router.push(`/movie/${props.movie.id}`);
};
</script>
