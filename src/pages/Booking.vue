<template>
  <!-- Booking Timer -->
  <BookingTimer @expired="handleTimerExpired" />

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

    <!-- Loading State -->
    <div v-if="movieLoading" class="text-center text-gray-600 text-lg py-10">
      Loading movie details...
    </div>

    <!-- Error or No Movie -->
    <div v-else-if="!movie.id" class="text-center text-gray-600 text-lg py-10">
      Movie not found.
    </div>

    <!-- Movie Info Card -->
    <div v-else class="bg-linear-to-r from-gray-50 to-white border border-gray-200 rounded-xl shadow-md p-6 mb-8">
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

    <!-- Booking Steps - Only show when movie is loaded -->
    <template v-if="movie.id">
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
        @click="continueToSeats"
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
        :movie-id="movie.id"
        :theatre-id="selectedTheatre.id"
        :showtime="selectedTime"
      />

      <button
        class="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
        :disabled="selectedSeats.length === 0"
        @click="confirmBooking"
      >
        Confirm Booking
      </button>
    </div>
    </template>

    <!-- Booking Confirmation Modal -->
    <BookingConfirmationModal
      :show="showConfirmationModal"
      :booking="confirmedBooking"
      @close="closeModal"
      @view-bookings="handleViewBookings"
    />

    <!-- Navigation Warning Modal -->
    <NavigationWarningModal
      :show="showNavigationWarning"
      @confirm="handleLeaveConfirm"
      @cancel="showNavigationWarning = false"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, defineAsyncComponent } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { useMoviesStore } from "../store/movies";
import { useBookingsStore } from "../store/bookings";
import { storeToRefs } from "pinia";
import SeatGrid from "../components/SeatGrid.vue";
import BookingTimer from "../components/BookingTimer.vue";
import { theatreLayouts } from "../data/theatreLayouts";

const BookingConfirmationModal = defineAsyncComponent(() => 
  import("../components/BookingConfirmationModal.vue")
);
const NavigationWarningModal = defineAsyncComponent(() => 
  import("../components/NavigationWarningModal.vue")
);

const route = useRoute();
const router = useRouter();
const moviesStore = useMoviesStore();
const bookingsStore = useBookingsStore();

// Computed properties for state
const { movies, loading: movieLoading, selectedMovie } = storeToRefs(moviesStore);
const { currentBooking, timerActive, timeRemaining } = storeToRefs(bookingsStore);

// Handle browser reload/close
const handleBeforeUnload = (event) => {
  if (timerActive.value && !showConfirmationModal.value) {
    showNavigationWarning.value = true;
    
    event.preventDefault();
    event.returnValue = '';
    return '';
  }
};

// Handle keydown for F5 / Ctrl+R
const handleKeydown = (event) => {
  if ((event.key === 'F5') || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'r')) {
    if (timerActive.value && !showConfirmationModal.value) {
      event.preventDefault();
      showNavigationWarning.value = true;
    }
  }
};

// Fetch movies if not already loaded, then get the specific movie
onMounted(async () => {
  window.addEventListener('beforeunload', handleBeforeUnload);
  window.addEventListener('keydown', handleKeydown);

  if (movies.value.length === 0) {
    await moviesStore.fetchMovies();
  }
  moviesStore.getMovie(route.params.id);
  
  // Restore state from store if available
  if (currentBooking.value.movieId === route.params.id) {
    // Restore theatre
    if (currentBooking.value.theatre) {
      selectedTheatre.value = currentBooking.value.theatre;
      selectedLayout.value = theatreLayouts[currentBooking.value.theatre.id].layout;
      step.value = 2;
    }
    
    // Restore showtime
    if (currentBooking.value.showtime) {
      selectedTime.value = currentBooking.value.showtime;
      step.value = 3;
    }
    
    // Restore seats
    if (currentBooking.value.seats && currentBooking.value.seats.length > 0) {
      selectedSeats.value = currentBooking.value.seats;
    }
  } else {
    // If booking is for a different movie, clear it
    bookingsStore.clearCurrentBooking();
    bookingsStore.stopTimer();
  }
  
  // Check if timer expired while we were away
  if (timerActive.value && timeRemaining.value === 0) {
    handleTimerExpired();
  }
});

// Make movie reactive - it will update when selectedMovie changes
const movie = selectedMovie;

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

// Modal state
const showConfirmationModal = ref(false);
const confirmedBooking = ref(null);
const showNavigationWarning = ref(false);
let pendingNavigation = null;

// click theatre → move to next step
const selectTheatre = (theatre) => {
  selectedTheatre.value = theatre;
  selectedLayout.value = theatreLayouts[theatre.id].layout;
  
  // Save theatre selection to bookings store
  bookingsStore.setCurrentBooking({
    movieId: movie.value.id,
    movieTitle: movie.value.title,
    theatre: {
      id: theatre.id,
      name: theatre.name,
      location: theatre.location
    }
  });
  
  // Start timer when booking begins
  bookingsStore.startTimer();
  
  step.value = 2;
};

// Show times
const showTimes = ["9:00 AM", "1:00 PM", "4:30 PM", "7:00 PM", "10:15 PM"];

// Continue to seat selection
const continueToSeats = () => {
  // Save showtime to store so it persists
  bookingsStore.setCurrentBooking({
    showtime: selectedTime.value
  });
  step.value = 3;
};

const confirmBooking = async () => {
  // Update current booking with final details
  bookingsStore.setCurrentBooking({
    showtime: selectedTime.value,
    seats: selectedSeats.value
  });
  
  // Confirm and save booking to localStorage
  const booking = await bookingsStore.confirmBooking();
  
  // Stop timer when booking is confirmed
  bookingsStore.stopTimer();
  
  // Show confirmation modal
  confirmedBooking.value = booking;               
  showConfirmationModal.value = true;
};

// Close modal and redirect
const closeModal = () => {
  showConfirmationModal.value = false;
  
  // Redirect to home page after modal closes
  setTimeout(() => {
    router.push('/');
  }, 300);
};

// Handle view bookings - just close modal without redirect
const handleViewBookings = () => {
  showConfirmationModal.value = false;
  // Navigation is handled by the modal component
};

// Go back to previous page
const goBack = () => {
  if (timerActive.value) {
    showNavigationWarning.value = true;
    pendingNavigation = 'back';
  } else {
    router.back();
  }
};

// Handle timer expiration
const handleTimerExpired = () => {
  // Clear booking data
  bookingsStore.clearCurrentBooking();
  bookingsStore.stopTimer();
  
  // Redirect to home page
  router.push('/');
};

// Handle confirmed leave
const handleLeaveConfirm = () => {
  showNavigationWarning.value = false;
  bookingsStore.stopTimer();
  bookingsStore.clearCurrentBooking();
  
  if (pendingNavigation === 'back') {
    router.back();
  } else if (pendingNavigation) {
    router.push(pendingNavigation);
  } else {
    // Default redirect if no navigation was pending (e.g. after cancelled reload)
    router.push('/');
  }
  pendingNavigation = null;
};

// Navigation guard for route changes
onBeforeRouteLeave((to, from, next) => {
  if (timerActive.value && !showConfirmationModal.value) {
    showNavigationWarning.value = true;
    pendingNavigation = to.path;
    next(false);
  } else {
    next();
  }
});

// Cleanup timer on component unmount
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
  window.removeEventListener('keydown', handleKeydown);

  // Don't stop timer if booking was confirmed (modal is showing)
  if (!showConfirmationModal.value && timerActive.value) {
    bookingsStore.stopTimer();
    bookingsStore.clearCurrentBooking();
  }
});
</script>
