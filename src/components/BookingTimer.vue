<template>
  <div 
    v-if="timerActive"
    :class="[
      'fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300',
      isLowTime ? 'bg-linear-to-r from-red-500 to-red-600 animate-pulse' : 'bg-linear-to-r from-purple-500 to-purple-600'
    ]"
  >
    <div class="flex items-center gap-3 text-white">
      <!-- Timer Icon -->
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      
      <!-- Timer Display -->
      <div class="flex flex-col">
        <span class="text-xs font-medium opacity-90">Time Remaining</span>
        <span class="text-2xl font-bold tabular-nums">{{ formattedTime }}</span>
      </div>
      
      <!-- Warning Icon (shown when low on time) -->
      <svg v-if="isLowTime" class="w-6 h-6 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const emit = defineEmits(['expired']);

// Current time remaining in seconds - computed from store
const timeRemaining = computed(() => store.getters['bookings/timeRemaining']);
const timerActive = computed(() => store.state.bookings.timerActive);

// Format time as MM:SS
const formattedTime = computed(() => {
  const minutes = Math.floor(timeRemaining.value / 60);
  const seconds = timeRemaining.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// Check if time is running low (less than 2 minutes)
const isLowTime = computed(() => timeRemaining.value < 120 && timeRemaining.value > 0);

let intervalId = null;

// Update timer every second
const updateTimer = () => {
  // Update store's tick to trigger getter re-computation
  store.dispatch('bookings/updateTick');
  
  // Check if timer expired
  if (timeRemaining.value === 0 && timerActive.value) {
    emit('expired');
    stopInterval();
  }
};

const startInterval = () => {
  if (!intervalId) {
    intervalId = setInterval(updateTimer, 1000);
  }
};

const stopInterval = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

// Watch for timer active state changes
watch(timerActive, (isActive) => {
  if (isActive) {
    startInterval();
  } else {
    stopInterval();
  }
}, { immediate: true });

onUnmounted(() => {
  stopInterval();
});
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>
