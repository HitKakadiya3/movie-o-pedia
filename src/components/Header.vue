<template>
  <nav class="bg-white shadow-md py-3 px-6 flex justify-between items-center">
    <!-- Logo -->
    <router-link to="/" class="text-2xl font-bold text-purple-600 cursor-pointer hover:text-purple-700 transition">
      JustWatch
    </router-link>

    <!-- Search Bar -->
    <div class="flex-1 mx-6">
      <input
        type="text"
        v-model="store.searchText"
        placeholder="Search for Movies"
        class="w-full border rounded-md px-4 py-2 shadow-sm focus:outline-purple-500"
      />
    </div>

    <!-- Right Options -->
    <div class="flex items-center gap-6">
      <!-- Location -->
      <button class="text-sm flex items-center gap-1 hover:text-purple-500">
        📍 Surat
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useMovieStore } from '../store/movies';

const store = useMovieStore();
</script>
