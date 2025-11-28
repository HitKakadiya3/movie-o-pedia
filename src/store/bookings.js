import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useBookingsStore = defineStore('bookings', () => {
    // State
    const bookings = ref(JSON.parse(localStorage.getItem("bookings") || "[]"));
    const currentBooking = ref(JSON.parse(localStorage.getItem("currentBooking")) || {
        movieId: null,
        movieTitle: null,
        theatre: null,
        showtime: null,
        seats: [],
        bookingDate: null
    });

    // Timer state
    const timerActive = ref(JSON.parse(localStorage.getItem("timerActive")) || false);
    const timerStartTime = ref(JSON.parse(localStorage.getItem("timerStartTime")) || null);
    const timerDuration = 600; // 10 minutes in seconds
    const currentTick = ref(0);

    // Getters
    const allBookings = computed(() => {
        return [...bookings.value].sort((a, b) =>
            new Date(b.bookingDate) - new Date(a.bookingDate)
        );
    });

    const totalBookings = computed(() => bookings.value.length);

    const timeRemaining = computed(() => {
        if (!timerActive.value || !timerStartTime.value) {
            return 0;
        }
        // Access currentTick to make this reactive
        currentTick.value;
        const elapsed = Math.floor((Date.now() - timerStartTime.value) / 1000);
        const remaining = timerDuration - elapsed;
        return Math.max(0, remaining);
    });

    // Helper to get bookings by movie
    function getBookingsByMovie(movieId) {
        return bookings.value.filter(b => b.movieId === movieId);
    }

    // Helper to get booked seats
    function getBookedSeats(movieId, theatreId, showtime) {
        const bookedSeats = [];
        bookings.value.forEach(booking => {
            if (
                booking.movieId === movieId &&
                booking.theatre.id === theatreId &&
                booking.showtime === showtime &&
                booking.status === 'confirmed'
            ) {
                bookedSeats.push(...booking.seats);
            }
        });
        return bookedSeats;
    }

    // Actions
    function setCurrentBooking(bookingData) {
        currentBooking.value = {
            ...currentBooking.value,
            ...bookingData
        };
        localStorage.setItem("currentBooking", JSON.stringify(currentBooking.value));
    }

    function clearCurrentBooking() {
        currentBooking.value = {
            movieId: null,
            movieTitle: null,
            theatre: null,
            showtime: null,
            seats: [],
            bookingDate: null
        };
        localStorage.removeItem("currentBooking");
    }

    function confirmBooking() {
        const booking = {
            id: Date.now().toString(),
            movieId: currentBooking.value.movieId,
            movieTitle: currentBooking.value.movieTitle,
            theatre: currentBooking.value.theatre,
            showtime: currentBooking.value.showtime,
            seats: [...currentBooking.value.seats],
            bookingDate: new Date().toISOString(),
            status: "confirmed"
        };

        bookings.value.push(booking);
        localStorage.setItem("bookings", JSON.stringify(bookings.value));

        clearCurrentBooking();
        return booking;
    }

    function cancelBooking({ bookingId, seatsToCancel = null }) {
        const index = bookings.value.findIndex(b => b.id === bookingId);
        if (index !== -1) {
            const booking = bookings.value[index];

            if (!seatsToCancel || seatsToCancel.length === booking.seats.length) {
                bookings.value[index].status = "cancelled";
            } else {
                const remainingSeats = booking.seats.filter(seat => !seatsToCancel.includes(seat));
                if (remainingSeats.length === 0) {
                    bookings.value[index].status = "cancelled";
                } else {
                    bookings.value[index].seats = remainingSeats;
                }
            }
            localStorage.setItem("bookings", JSON.stringify(bookings.value));
        }
    }

    function deleteBooking(bookingId) {
        bookings.value = bookings.value.filter(b => b.id !== bookingId);
        localStorage.setItem("bookings", JSON.stringify(bookings.value));
    }

    function clearAllBookings() {
        bookings.value = [];
        localStorage.removeItem("bookings");
    }

    function startTimer() {
        timerActive.value = true;
        timerStartTime.value = Date.now();
        currentTick.value = 0;
        localStorage.setItem("timerActive", "true");
        localStorage.setItem("timerStartTime", JSON.stringify(timerStartTime.value));
    }

    function updateTick() {
        currentTick.value++;
    }

    function stopTimer() {
        timerActive.value = false;
        timerStartTime.value = null;
        localStorage.removeItem("timerActive");
        localStorage.removeItem("timerStartTime");
    }

    function isTimerExpired() {
        return timerActive.value && timeRemaining.value === 0;
    }

    return {
        bookings,
        currentBooking,
        timerActive,
        timerStartTime,
        currentTick,
        allBookings,
        totalBookings,
        timeRemaining,
        getBookingsByMovie,
        getBookedSeats,
        setCurrentBooking,
        clearCurrentBooking,
        confirmBooking,
        cancelBooking,
        deleteBooking,
        clearAllBookings,
        startTimer,
        updateTick,
        stopTimer,
        isTimerExpired
    };
});
