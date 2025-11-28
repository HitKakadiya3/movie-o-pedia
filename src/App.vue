<template>
  <div class="min-h-screen bg-gray-100">
    <GlobalLoader />
    <Header></Header>
    <RouterView />
    
    <!-- Booking Restoration Modal -->
    <BookingRestorationModal
      :show="showRestorationModal"
      @close="handleModalClose"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { RouterView, useRouter, useRoute } from 'vue-router';
import { useBookingsStore } from './store/bookings';
import Header from "./components/Header.vue";
import GlobalLoader from "./components/GlobalLoader.vue";
import BookingRestorationModal from "./components/BookingRestorationModal.vue";

const bookingsStore = useBookingsStore();
const router = useRouter();
const route = useRoute();

const showRestorationModal = ref(false);
const isInitialMount = ref(true);
const modalDismissedThisSession = ref(false);
const checkAndShowModal = () => {
  if (modalDismissedThisSession.value) {
    return;
  }

  const timerActive = bookingsStore.timerActive;
  const currentBooking = bookingsStore.currentBooking;
  const timeRemaining = bookingsStore.timeRemaining;
  
  if (timerActive && timeRemaining > 0 && currentBooking.movieId) {
    const isOnBookingPage = route.path === `/booking/${currentBooking.movieId}`;
    
    if (!isOnBookingPage) {
      showRestorationModal.value = true;
    }
  } else if (timerActive && timeRemaining === 0) {
    // Timer expired, clean up
    bookingsStore.stopTimer();
    bookingsStore.clearCurrentBooking();
  }
};

// Handle modal close
const handleModalClose = () => {
  showRestorationModal.value = false;
  // Mark as dismissed for this session
  modalDismissedThisSession.value = true;
};

// Check on mount
onMounted(() => {
  checkAndShowModal();
  
  // After mount, mark that initial mount is complete
  nextTick(() => {
    isInitialMount.value = false;
  });
});

watch(() => route.path, (newPath, oldPath) => {
  // Skip if this is the initial mount
  if (isInitialMount.value) {
    return;
  }
  
  const currentBooking = bookingsStore.currentBooking;
  
  // If user navigates to the booking page, hide the modal and mark as dismissed
  if (currentBooking.movieId && newPath === `/booking/${currentBooking.movieId}`) {
    showRestorationModal.value = false;
    modalDismissedThisSession.value = true;
  }
});
</script>
