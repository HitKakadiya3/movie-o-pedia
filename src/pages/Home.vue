<template>
  <div>

    <!-- Banner Carousel - Full Width -->
    <div class="mb-6">
      <div class="relative w-full overflow-hidden">
        <!-- Carousel wrapper -->
        <div class="relative h-64 md:h-96 overflow-hidden rounded-lg">
          <!-- Carousel items -->
          <div
            v-for="(banner, index) in banners"
            :key="index"
            :class="[
              'absolute inset-0 transition-opacity duration-700 ease-in-out',
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            ]"
          >
            <img
              :src="banner.image"
              :alt="banner.alt"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

        <!-- Slider indicators -->
        <div class="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
          <button
            v-for="(banner, index) in banners"
            :key="index"
            type="button"
            :class="[
              'w-3 h-3 rounded-full transition-all',
              currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
            ]"
            :aria-current="currentSlide === index"
            :aria-label="`Slide ${index + 1}`"
            @click="goToSlide(index)"
          ></button>
        </div>

        <!-- Slider controls -->
        <button
          type="button"
          class="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          @click="prevSlide"
        >
          <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 transition">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span class="sr-only">Previous</span>
          </span>
        </button>
        <button
          type="button"
          class="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          @click="nextSlide"
        >
          <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 transition">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span class="sr-only">Next</span>
          </span>
        </button>
      </div>
    </div>

    <!-- Movies Section with Padding -->
    <div class="px-6 pb-6">
      <h2 class="text-2xl font-semibold mb-4">Recommended Movies</h2>
      <div
        v-if="store.filteredMovies.length === 0"
        class="text-center text-gray-600 text-lg mt-10"
      >
        No movies found.
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <MovieCard
          v-for="m in store.filteredMovies"
          :key="m.id"
          :movie="m"
        />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import MovieCard from "../components/MovieCard.vue";
import { useMovieStore } from "../store/movies";

const store = useMovieStore();
const movies = store.movies;

// Carousel data
const banners = [
  { image: "/banner-avengers.png", alt: "Avengers Banner" },
  { image: "/banner-inception.png", alt: "Inception Banner" },
  { image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920&h=500&fit=crop&q=90", alt: "Interstellar Space Banner" },
  { image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&h=500&fit=crop&q=90", alt: "Dark City Banner" },
  { image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&h=500&fit=crop&q=90", alt: "Star Wars Space Banner" }
];

const currentSlide = ref(0);
let intervalId = null;

// Carousel functions
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % banners.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + banners.length) % banners.length;
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

// Auto-play carousel
const startAutoPlay = () => {
  intervalId = setInterval(() => {
    nextSlide();
  }, 4000); // Change slide every 4 seconds
};

const stopAutoPlay = () => {
  if (intervalId) {
    clearInterval(intervalId);
  }
};

// Lifecycle hooks
onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>
