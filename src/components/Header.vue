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
        v-model="searchText"
        placeholder="Search for Movies"
        class="w-full border rounded-md px-4 py-2 shadow-sm focus:outline-purple-500"
      />
    </div>

    <!-- Right Options -->
    <div class="flex items-center gap-6">
      <!-- My Bookings -->
      <router-link 
        to="/bookings" 
        class="text-sm flex items-center gap-2 hover:text-purple-600 transition font-medium relative"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        <span>My Bookings</span>
        <span 
          v-if="totalBookings > 0"
          class="absolute -top-2 -right-3 bg-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
        >
          {{ totalBookings }}
        </span>
      </router-link>
      
      <!-- Location -->
      <button class="text-sm flex items-center gap-1 hover:text-purple-500">
        📍 Surat
      </button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const searchText = computed({
  get: () => store.state.movies.searchText,
  set: (val) => store.dispatch('movies/setSearchText', val)
});

const totalBookings = computed(() => store.getters['bookings/totalBookings']);
</script>
