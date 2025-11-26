<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" @click.self="close">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <!-- Modal Container -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
          
          <!-- Warning Icon -->
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-6">
            <svg class="h-10 w-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <!-- Title -->
          <h3 class="text-2xl font-bold text-center text-gray-900 mb-2">
            Cancel Booking
          </h3>
          
          <p class="text-center text-gray-500 text-sm mb-6">
            Choose which seats to cancel
          </p>

          <!-- Booking Info -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <p class="text-sm font-semibold text-gray-900 mb-1">{{ booking.movieTitle }}</p>
            <p class="text-xs text-gray-600">{{ booking.theatre?.name }} • {{ booking.showtime }}</p>
          </div>

          <!-- Seat Selection -->
          <div class="mb-6">
            <p class="text-sm font-medium text-gray-700 mb-3">Select seats to cancel:</p>
            
            <div class="flex flex-wrap gap-2 mb-4">
              <button
                v-for="seat in booking.seats"
                :key="seat"
                @click="toggleSeat(seat)"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition',
                  selectedSeats.includes(seat)
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
              >
                {{ seat }}
              </button>
            </div>

            <!-- Select All / Deselect All -->
            <div class="flex gap-2">
              <button
                @click="selectAll"
                class="text-xs text-purple-600 hover:text-purple-700 font-medium"
              >
                Select All
              </button>
              <span class="text-xs text-gray-400">•</span>
              <button
                @click="deselectAll"
                class="text-xs text-purple-600 hover:text-purple-700 font-medium"
              >
                Deselect All
              </button>
            </div>
          </div>

          <!-- Warning Message -->
          <div v-if="selectedSeats.length > 0" class="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
            <p class="text-xs text-orange-800">
              <strong>Warning:</strong> 
              {{ selectedSeats.length === booking.seats.length 
                ? 'This will cancel the entire booking.' 
                : `${selectedSeats.length} seat(s) will be cancelled.` }}
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button
              @click="confirmCancel"
              :disabled="selectedSeats.length === 0"
              :class="[
                'flex-1 px-6 py-3 rounded-lg font-semibold transition',
                selectedSeats.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              ]"
            >
              Cancel {{ selectedSeats.length === booking.seats.length ? 'Booking' : 'Selected Seats' }}
            </button>
            <button
              @click="close"
              class="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Keep Booking
            </button>
          </div>

        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';

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
      theatre: { name: '' },
      showtime: '',
      seats: []
    })
  }
});

const emit = defineEmits(['close', 'confirm']);

const selectedSeats = ref([]);

// Reset selection when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    selectedSeats.value = [];
  }
});

const toggleSeat = (seat) => {
  const index = selectedSeats.value.indexOf(seat);
  if (index > -1) {
    selectedSeats.value.splice(index, 1);
  } else {
    selectedSeats.value.push(seat);
  }
};

const selectAll = () => {
  selectedSeats.value = [...props.booking.seats];
};

const deselectAll = () => {
  selectedSeats.value = [];
};

const confirmCancel = () => {
  if (selectedSeats.value.length > 0) {
    emit('confirm', {
      bookingId: props.booking.id,
      seatsToCancel: selectedSeats.value,
      cancelAll: selectedSeats.value.length === props.booking.seats.length
    });
  }
};

const close = () => {
  emit('close');
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
