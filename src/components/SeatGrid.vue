<template>
  <div class="bg-white p-6 rounded-lg shadow">

    <!-- SCREEN -->
    <div class="flex justify-center mb-6">
      <div class="w-2/3 h-2 bg-gray-300 rounded-full"></div>
    </div>
    <p class="text-center text-gray-500 text-sm mb-8">SCREEN THIS WAY</p>

    <!-- SEAT CATEGORIES -->
    <div
      v-for="category in seatLayout"
      :key="category.label"
      class="mb-10"
    >

      <!-- Category Label -->
      <h3 class="font-semibold text-gray-800 mb-3">
        {{ category.label }} - ₹{{ category.price }}
      </h3>

      <!-- Seat Rows -->
      <div class="space-y-4">

        <div
          v-for="row in category.rows"
          :key="row.row"
          class="flex items-center justify-center gap-6"
        >

          <!-- Row Label (Left) -->
          <div class="w-6 text-sm font-semibold text-gray-700">{{ row.row }}</div>

          <!-- LEFT BLOCK -->
          <div class="flex gap-2">
            <button
              v-for="seat in row.left"
              :key="seat"
              @click="toggleSeat(seat)"
              :disabled="isBooked(seat)"
              :class="seatClass(seat)"
            >
              {{ seat }}
            </button>
          </div>

          <!-- AISLE GAP -->
          <div class="mx-6"></div>

          <!-- RIGHT BLOCK -->
          <div class="flex gap-2">
            <button
              v-for="seat in row.right"
              :key="seat"
              @click="toggleSeat(seat)"
              :disabled="isBooked(seat)"
              :class="seatClass(seat)"
            >
              {{ seat }}
            </button>
          </div>

          <!-- Row Label (Right) -->
          <div class="w-6 text-sm font-semibold text-gray-700">{{ row.row }}</div>

        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
  modelValue: Array,
  layout: Array,
  movieId: String,
  theatreId: String,
  showtime: String
});

const emit = defineEmits(["update:modelValue"]);

const store = useStore();

// Get booked seats from store based on movie, theatre, and showtime
const bookedSeats = computed(() => {
  if (!props.movieId || !props.theatreId || !props.showtime) {
    return [];
  }
  return store.getters['bookings/getBookedSeats'](props.movieId, props.theatreId, props.showtime);
});

// Row seat styles
const seatClass = (seat) => [
  "w-8 h-8 flex items-center justify-center rounded text-xs border transition",
  bookedSeats.value.includes(seat)
    ? "bg-red-500 text-white border-red-600 cursor-not-allowed"
    : props.modelValue.includes(seat)
    ? "bg-green-600 text-white border-green-700"
    : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
];

// Check if booked
const isBooked = (s) => bookedSeats.value.includes(s);

// **BookMyShow dual seating layout**
const seatLayout = props.layout;

const toggleSeat = (seat) => {
  let selected = [...props.modelValue];

  if (selected.includes(seat)) {
    selected = selected.filter(s => s !== seat);
  } else {
    selected.push(seat);
  }

  emit("update:modelValue", selected);
};
</script>
