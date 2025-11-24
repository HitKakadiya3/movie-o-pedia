<template>
  <div class="p-6 max-w-5xl mx-auto">

    <!-- Back Button -->
    <div class="mb-4">
      <button
        @click="goBack"
        class="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow hover:bg-gray-50 transition border border-gray-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
    </div>

    <h1 class="text-3xl font-bold mb-6">Book Tickets</h1>

    <!-- Movie Info Card -->
    <div class="bg-linear-to-r from-gray-50 to-white border border-gray-200 rounded-xl shadow-md p-6 mb-8">
      <div class="flex items-start gap-6">
        <!-- Movie Poster -->
        <div class="shrink-0">
          <img 
            :src="movie.poster" 
            class="w-32 h-48 rounded-lg shadow-lg object-cover border-2 border-gray-200" 
            :alt="movie.title"
          />
        </div>
        
        <!-- Movie Details -->
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ movie.title }}</h2>
          
          <!-- Genres -->
          <div class="flex flex-wrap gap-2 mb-3">
            <span 
              v-for="(genre, index) in movie.genres?.split(', ')" 
              :key="index"
              class="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full"
            >
              {{ genre }}
            </span>
          </div>
          
          <!-- Movie Info -->
          <div class="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
            <div class="flex items-center gap-1">
              <span>⏱️</span>
              <span>{{ movie.duration }}</span>
            </div>
            <div class="flex items-center gap-1">
              <span>⭐</span>
              <span>{{ movie.rating }}/5</span>
            </div>
          </div>
          
          <!-- Description -->
          <p class="text-gray-700 text-sm line-clamp-2">
            {{ movie.description || "No description available." }}
          </p>
        </div>
      </div>
    </div>

    <!-- STEP NAVIGATION -->
    <div class="flex gap-2 mb-8 text-sm">
      <div :class="[step === 1 ? activeTab : inactiveTab]">1. Select Theatre</div>
      <div :class="[step === 2 ? activeTab : inactiveTab]">2. Select Showtime</div>
      <div :class="[step === 3 ? activeTab : inactiveTab]">3. Select Seats</div>
    </div>


    <!-- ===== STEP 1 — SELECT THEATRE ===== -->
    <div v-if="step === 1">
      <h3 class="text-xl font-semibold mb-4">Select Theatre</h3>

      <div class="flex flex-col gap-4">
        <div
          v-for="t in theaters"
          :key="t.id"
          class="p-4 border rounded-lg bg-white shadow-sm cursor-pointer hover:bg-gray-100"
          @click="selectTheatre(t)"
        >
          <div class="font-semibold">{{ t.name }}</div>
          <div class="text-sm text-gray-600">{{ t.location }}</div>
        </div>
      </div>
    </div>


    <!-- ===== STEP 2 — SELECT SHOWTIME ===== -->
    <div v-if="step === 2">
      <h3 class="text-xl font-semibold mb-4">Select Showtime</h3>

      <p class="mb-4 text-gray-700 font-medium">Theatre: {{ selectedTheatre.name }}</p>

      <div class="flex flex-wrap gap-3">
        <button
          v-for="time in showTimes"
          :key="time"
          @click="selectedTime = time"
          :class="[
            'px-4 py-2 rounded-md border text-sm',
            selectedTime === time ? 'bg-purple-600 text-white' : 'bg-white'
          ]"
        >
          {{ time }}
        </button>
      </div>

      <button
        class="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
        :disabled="!selectedTime"
        @click="step = 3"
      >
        Continue to Seat Selection
      </button>
    </div>


    <!-- ===== STEP 3 — SELECT SEATS ===== -->
    <div v-if="step === 3">
      <h3 class="text-xl font-semibold mb-4">Select Seats</h3>

      <p class="mb-4 text-gray-700 font-medium">
        {{ selectedTheatre.name }} — {{ selectedTime }}
      </p>

      <SeatGrid
        v-if="step === 3"
        v-model="selectedSeats"
        :layout="selectedLayout"
      />

      <button
        class="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
        :disabled="selectedSeats.length === 0"
        @click="confirmBooking"
      >
        Confirm Booking
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMovieStore } from "../store/movies";
import SeatGrid from "../components/SeatGrid.vue";
import { theatreLayouts } from "../data/theatreLayouts";

const route = useRoute();
const router = useRouter();
const movieStore = useMovieStore();

// load movie
movieStore.getMovie(route.params.id);
const movie = movieStore.selectedMovie;

// steps
const step = ref(1);

// UI classes
const activeTab = "px-4 py-2 bg-purple-600 text-white rounded-md shadow";
const inactiveTab = "px-4 py-2 bg-gray-200 text-gray-600 rounded-md";

// Theatre list
const theaters = [
  { id: "inox", name: "INOX City Gold", location: "Ashram Road" },
  { id: "pvr", name: "PVR Acropolis", location: "Thaltej" },
  { id: "cinemax", name: "Cinemax Himalaya Mall", location: "Drive-in Road" },
  { id: "mukta", name: "Mukta A2 Cinema", location: "Iscon Circle" }
];

const selectedTheatre = ref(null);
const selectedTime = ref("");
const selectedSeats = ref([]);
const selectedLayout = ref([]);

// click theatre → move to next step
const selectTheatre = (theatre) => {
  selectedTheatre.value = theatre;
  selectedLayout.value = theatreLayouts[theatre.id].layout;
  step.value = 2;
};

// Show times
const showTimes = ["9:00 AM", "1:00 PM", "4:30 PM", "7:00 PM", "10:15 PM"];

const confirmBooking = () => {
  alert(`
Booking Confirmed 🎉

Movie: ${movie.title}
Theatre: ${selectedTheatre.value.name}
Time: ${selectedTime.value}
Seats: ${selectedSeats.value.join(", ")}
  `);
};

// Go back to previous page
const goBack = () => {
  router.back();
};
</script>
