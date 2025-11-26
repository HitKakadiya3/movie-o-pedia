<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-6xl mx-auto">
      
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800">My Bookings</h1>
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

      <!-- Stats Card -->
      <div class="bg-linear-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-6 mb-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm font-medium">Total Bookings</p>
            <p class="text-4xl font-bold mt-1">{{ bookingsStore.totalBookings }}</p>
          </div>
          <div class="bg-white/20 p-4 rounded-full">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- No Bookings State -->
      <div v-if="bookingsStore.totalBookings === 0" class="bg-white rounded-lg shadow-md p-12 text-center">
        <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">No Bookings Yet</h3>
        <p class="text-gray-500 mb-6">Start booking your favorite movies now!</p>
        <button
          @click="router.push('/')"
          class="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          Browse Movies
        </button>
      </div>

      <!-- Bookings List -->
      <div v-else class="space-y-4">
        <div
          v-for="booking in bookingsStore.allBookings"
          :key="booking.id"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
        >
          <div class="flex items-start justify-between">
            
            <!-- Booking Details -->
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <h3 class="text-xl font-bold text-gray-800">{{ booking.movieTitle }}</h3>
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  ]"
                >
                  {{ booking.status.toUpperCase() }}
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span><strong>Theatre:</strong> {{ booking.theatre.name }}</span>
                </div>

                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{{ booking.theatre.location }}</span>
                </div>

                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Showtime:</strong> {{ booking.showtime }}</span>
                </div>

                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span><strong>Booked:</strong> {{ formatDate(booking.bookingDate) }}</span>
                </div>
              </div>

              <div class="mt-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-sm text-gray-600">
                  <strong>Seats:</strong> {{ booking.seats.join(', ') }}
                </span>
              </div>

              <div class="mt-2 text-xs text-gray-400">
                Booking ID: {{ booking.id }}
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col gap-2 ml-4">
              <button
                v-if="booking.status === 'confirmed'"
                @click="cancelBooking(booking.id)"
                class="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition"
              >
                Cancel
              </button>
              <button
                @click="deleteBooking(booking.id)"
                class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Clear All Button -->
      <div v-if="bookingsStore.totalBookings > 0" class="mt-6 text-center">
        <button
          @click="clearAll"
          class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Clear All Bookings
        </button>
      </div>

    </div>

    <!-- Cancel Booking Modal -->
    <CancelBookingModal
      :show="showCancelModal"
      :booking="bookingToCancel"
      @close="closeCancelModal"
      @confirm="handleCancelConfirm"
    />

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { useBookingsStore } from "../store/bookings";
import CancelBookingModal from "../components/CancelBookingModal.vue";

const router = useRouter();
const bookingsStore = useBookingsStore();

// Cancel modal state
const showCancelModal = ref(false);
const bookingToCancel = ref(null);

// Format date to readable format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Open cancel modal
const cancelBooking = (bookingId) => {
  const booking = bookingsStore.bookings.find(b => b.id === bookingId);
  if (booking) {
    bookingToCancel.value = booking;
    showCancelModal.value = true;
  }
};

// Close cancel modal
const closeCancelModal = () => {
  showCancelModal.value = false;
  bookingToCancel.value = null;
};

// Handle cancel confirmation
const handleCancelConfirm = ({ bookingId, seatsToCancel, cancelAll }) => {
  bookingsStore.cancelBooking(bookingId, seatsToCancel);
  closeCancelModal();
};

// Delete booking
const deleteBooking = (bookingId) => {
  if (confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
    bookingsStore.deleteBooking(bookingId);
  }
};

// Clear all bookings
const clearAll = () => {
  if (confirm('Are you sure you want to clear all bookings? This action cannot be undone.')) {
    bookingsStore.clearAllBookings();
  }
};

// Go back
const goBack = () => {
  router.back();
};
</script>
