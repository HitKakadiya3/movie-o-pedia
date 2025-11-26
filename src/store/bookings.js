import { defineStore } from "pinia";

export const useBookingsStore = defineStore("bookings", {
    state: () => ({
        // Initialize from localStorage (persists across browser sessions)
        bookings: JSON.parse(localStorage.getItem("bookings") || "[]"),
        currentBooking: JSON.parse(localStorage.getItem("currentBooking")) || {
            movieId: null,
            movieTitle: null,
            theatre: null,
            showtime: null,
            seats: [],
            bookingDate: null
        },
        // Booking timer state - restore from localStorage if available
        timerActive: JSON.parse(localStorage.getItem("timerActive")) || false,
        timerStartTime: JSON.parse(localStorage.getItem("timerStartTime")) || null,
        timerDuration: 600, // 10 minutes in seconds
        currentTick: 0 // Reactive tick counter for timer updates
    }),

    getters: {
        // Get all bookings sorted by date (newest first)
        allBookings(state) {
            return [...state.bookings].sort((a, b) =>
                new Date(b.bookingDate) - new Date(a.bookingDate)
            );
        },

        // Get bookings for a specific movie
        getBookingsByMovie: (state) => (movieId) => {
            return state.bookings.filter(b => b.movieId === movieId);
        },

        // Get total number of bookings
        totalBookings(state) {
            return state.bookings.length;
        },

        // Get booked seats for a specific movie, theatre, and showtime
        getBookedSeats: (state) => (movieId, theatreId, showtime) => {
            const bookedSeats = [];

            // Find all confirmed bookings for this movie/theatre/showtime
            state.bookings.forEach(booking => {
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
        },

        // Get remaining time in seconds
        timeRemaining(state) {
            if (!state.timerActive || !state.timerStartTime) {
                return 0;
            }
            // Access currentTick to make this reactive
            state.currentTick;
            const elapsed = Math.floor((Date.now() - state.timerStartTime) / 1000);
            const remaining = state.timerDuration - elapsed;
            return Math.max(0, remaining);
        }
    },

    actions: {
        // Set current booking details (during booking flow)
        setCurrentBooking(bookingData) {
            this.currentBooking = {
                ...this.currentBooking,
                ...bookingData
            };
            localStorage.setItem("currentBooking", JSON.stringify(this.currentBooking));
        },

        // Clear current booking
        clearCurrentBooking() {
            this.currentBooking = {
                movieId: null,
                movieTitle: null,
                theatre: null,
                showtime: null,
                seats: [],
                bookingDate: null
            };
            localStorage.removeItem("currentBooking");
        },

        // Confirm and save booking
        confirmBooking() {
            const booking = {
                id: Date.now().toString(), // Simple unique ID
                movieId: this.currentBooking.movieId,
                movieTitle: this.currentBooking.movieTitle,
                theatre: this.currentBooking.theatre,
                showtime: this.currentBooking.showtime,
                seats: [...this.currentBooking.seats],
                bookingDate: new Date().toISOString(),
                status: "confirmed"
            };

            this.bookings.push(booking);

            // Save to localStorage
            localStorage.setItem("bookings", JSON.stringify(this.bookings));

            // Clear current booking
            this.clearCurrentBooking();

            return booking;
        },

        // Cancel specific seats or entire booking
        cancelBooking(bookingId, seatsToCancel = null) {
            const index = this.bookings.findIndex(b => b.id === bookingId);
            if (index !== -1) {
                const booking = this.bookings[index];

                // If no specific seats provided or all seats selected, cancel entire booking
                if (!seatsToCancel || seatsToCancel.length === booking.seats.length) {
                    this.bookings[index].status = "cancelled";
                } else {
                    // Remove specific seats from the booking
                    const remainingSeats = booking.seats.filter(seat => !seatsToCancel.includes(seat));

                    if (remainingSeats.length === 0) {
                        // If no seats remain, cancel the entire booking
                        this.bookings[index].status = "cancelled";
                    } else {
                        // Update booking with remaining seats
                        this.bookings[index].seats = remainingSeats;
                    }
                }

                localStorage.setItem("bookings", JSON.stringify(this.bookings));
            }
        },

        // Delete a booking
        deleteBooking(bookingId) {
            this.bookings = this.bookings.filter(b => b.id !== bookingId);
            localStorage.setItem("bookings", JSON.stringify(this.bookings));
        },

        // Clear all bookings
        clearAllBookings() {
            this.bookings = [];
            localStorage.removeItem("bookings");
        },

        // Start booking timer
        startTimer() {
            this.timerActive = true;
            this.timerStartTime = Date.now();
            this.currentTick = 0;

            localStorage.setItem("timerActive", "true");
            localStorage.setItem("timerStartTime", JSON.stringify(this.timerStartTime));
        },

        // Update timer tick (called every second by component)
        updateTick() {
            this.currentTick++;
        },

        // Stop booking timer
        stopTimer() {
            this.timerActive = false;
            this.timerStartTime = null;

            localStorage.removeItem("timerActive");
            localStorage.removeItem("timerStartTime");
        },

        // Check if timer has expired
        isTimerExpired() {
            return this.timerActive && this.timeRemaining === 0;
        }
    }
});
