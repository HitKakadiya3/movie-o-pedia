<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" @click.self="close">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <!-- Modal Container -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
          
          <!-- Success Icon -->
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg class="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <!-- Title -->
          <h3 class="text-2xl font-bold text-center text-gray-900 mb-2">
            Booking Confirmed! 🎉
          </h3>
          
          <p class="text-center text-gray-500 text-sm mb-6">
            Your tickets have been successfully booked
          </p>

          <!-- Booking Details -->
          <div class="bg-linear-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6 space-y-3">
            <!-- Movie Title -->
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-purple-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              <div class="flex-1">
                <p class="text-xs text-gray-500 font-medium">Movie</p>
                <p class="text-sm font-bold text-gray-900">{{ booking.movieTitle }}</p>
              </div>
            </div>

            <!-- Theatre -->
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-purple-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <div class="flex-1">
                <p class="text-xs text-gray-500 font-medium">Theatre</p>
                <p class="text-sm font-bold text-gray-900">{{ booking.theatre.name }}</p>
                <p class="text-xs text-gray-500">{{ booking.theatre.location }}</p>
              </div>
            </div>

            <!-- Showtime -->
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-purple-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="flex-1">
                <p class="text-xs text-gray-500 font-medium">Showtime</p>
                <p class="text-sm font-bold text-gray-900">{{ booking.showtime }}</p>
              </div>
            </div>

            <!-- Seats -->
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-purple-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <div class="flex-1">
                <p class="text-xs text-gray-500 font-medium">Seats</p>
                <p class="text-sm font-bold text-gray-900">{{ booking.seats.join(', ') }}</p>
              </div>
            </div>

            <!-- Booking ID -->
            <div class="pt-3 border-t border-purple-200">
              <p class="text-xs text-gray-500">Booking ID</p>
              <p class="text-sm font-mono font-bold text-purple-600">{{ booking.id }}</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button
              @click="viewBookings"
              class="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              View My Bookings
            </button>
            <button
              @click="close"
              class="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  booking: {
    type: Object,
    default: () => ({
      id: '',
      movieTitle: '',
      theatre: { name: '', location: '' },
      showtime: '',
      seats: []
    })
  }
});

const emit = defineEmits(['close', 'view-bookings']);
const router = useRouter();

const close = () => {
  emit('close');
};

const viewBookings = () => {
  emit('view-bookings');
  router.push('/bookings');
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9);
  opacity: 0;
}
</style>
