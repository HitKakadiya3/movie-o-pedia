<template>
  <!-- Modal Backdrop -->
  <Transition name="modal">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      @click.self="$emit('cancel')"
    >
      <!-- Modal Content -->
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
        <!-- Warning Icon -->
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg class="w-10 h-10 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <!-- Title -->
        <h3 class="text-2xl font-bold text-gray-900 text-center mb-2">
          Leave Booking?
        </h3>

        <!-- Message -->
        <p class="text-gray-600 text-center mb-4">
          You have an active booking session with <span class="font-semibold text-purple-600">{{ formattedTime }}</span> remaining.
        </p>
        
        <p class="text-gray-600 text-center mb-6">
          If you leave now, your booking progress will be lost and you'll need to start over.
        </p>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button
            @click="$emit('cancel')"
            class="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition shadow-md"
          >
            Stay on Page
          </button>
          <button
            @click="$emit('confirm')"
            class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Leave Anyway
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';
import { useBookingsStore } from '../store/bookings';
import { storeToRefs } from 'pinia';

defineProps({
  show: {
    type: Boolean,
    required: true
  }
});

defineEmits(['confirm', 'cancel']);

const bookingsStore = useBookingsStore();
const { timeRemaining } = storeToRefs(bookingsStore);

// Format remaining time as MM:SS
const formattedTime = computed(() => {
  const time = timeRemaining.value;
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});
</script>

<style scoped>
/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
}
</style>
