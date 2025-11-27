// Vuex module for bookings
export default {
    namespaced: true,

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

    mutations: {
        SET_BOOKINGS(state, bookings) {
            state.bookings = bookings;
        },

        ADD_BOOKING(state, booking) {
            state.bookings.push(booking);
        },

        UPDATE_BOOKING(state, { index, booking }) {
            state.bookings[index] = booking;
        },

        DELETE_BOOKING(state, bookingId) {
            state.bookings = state.bookings.filter(b => b.id !== bookingId);
        },

        CLEAR_BOOKINGS(state) {
            state.bookings = [];
        },

        SET_CURRENT_BOOKING(state, bookingData) {
            state.currentBooking = {
                ...state.currentBooking,
                ...bookingData
            };
        },

        CLEAR_CURRENT_BOOKING(state) {
            state.currentBooking = {
                movieId: null,
                movieTitle: null,
                theatre: null,
                showtime: null,
                seats: [],
                bookingDate: null
            };
        },

        START_TIMER(state) {
            state.timerActive = true;
            state.timerStartTime = Date.now();
            state.currentTick = 0;
        },

        STOP_TIMER(state) {
            state.timerActive = false;
            state.timerStartTime = null;
        },

        UPDATE_TICK(state) {
            state.currentTick++;
        },

        CANCEL_BOOKING(state, { index, status, seats }) {
            if (seats) {
                state.bookings[index].seats = seats;
            }
            if (status) {
                state.bookings[index].status = status;
            }
        }
    },

    actions: {
        // Set current booking details (during booking flow)
        setCurrentBooking({ commit, state }, bookingData) {
            commit('SET_CURRENT_BOOKING', bookingData);
            localStorage.setItem("currentBooking", JSON.stringify(state.currentBooking));
        },

        // Clear current booking
        clearCurrentBooking({ commit }) {
            commit('CLEAR_CURRENT_BOOKING');
            localStorage.removeItem("currentBooking");
        },

        // Confirm and save booking
        confirmBooking({ commit, state }) {
            const booking = {
                id: Date.now().toString(), // Simple unique ID
                movieId: state.currentBooking.movieId,
                movieTitle: state.currentBooking.movieTitle,
                theatre: state.currentBooking.theatre,
                showtime: state.currentBooking.showtime,
                seats: [...state.currentBooking.seats],
                bookingDate: new Date().toISOString(),
                status: "confirmed"
            };

            commit('ADD_BOOKING', booking);

            // Save to localStorage
            localStorage.setItem("bookings", JSON.stringify(state.bookings));

            // Clear current booking
            commit('CLEAR_CURRENT_BOOKING');
            localStorage.removeItem("currentBooking");

            return booking;
        },

        // Cancel specific seats or entire booking
        cancelBooking({ commit, state }, { bookingId, seatsToCancel = null }) {
            const index = state.bookings.findIndex(b => b.id === bookingId);
            if (index !== -1) {
                const booking = state.bookings[index];

                // If no specific seats provided or all seats selected, cancel entire booking
                if (!seatsToCancel || seatsToCancel.length === booking.seats.length) {
                    commit('CANCEL_BOOKING', { index, status: "cancelled" });
                } else {
                    // Remove specific seats from the booking
                    const remainingSeats = booking.seats.filter(seat => !seatsToCancel.includes(seat));

                    if (remainingSeats.length === 0) {
                        // If no seats remain, cancel the entire booking
                        commit('CANCEL_BOOKING', { index, status: "cancelled" });
                    } else {
                        // Update booking with remaining seats
                        commit('CANCEL_BOOKING', { index, seats: remainingSeats });
                    }
                }

                localStorage.setItem("bookings", JSON.stringify(state.bookings));
            }
        },

        // Delete a booking
        deleteBooking({ commit, state }, bookingId) {
            commit('DELETE_BOOKING', bookingId);
            localStorage.setItem("bookings", JSON.stringify(state.bookings));
        },

        // Clear all bookings
        clearAllBookings({ commit }) {
            commit('CLEAR_BOOKINGS');
            localStorage.removeItem("bookings");
        },

        // Start booking timer
        startTimer({ commit, state }) {
            commit('START_TIMER');
            localStorage.setItem("timerActive", "true");
            localStorage.setItem("timerStartTime", JSON.stringify(state.timerStartTime));
        },

        // Update timer tick (called every second by component)
        updateTick({ commit }) {
            commit('UPDATE_TICK');
        },

        // Stop booking timer
        stopTimer({ commit }) {
            commit('STOP_TIMER');
            localStorage.removeItem("timerActive");
            localStorage.removeItem("timerStartTime");
        },

        // Check if timer has expired
        isTimerExpired({ state, getters }) {
            return state.timerActive && getters.timeRemaining === 0;
        }
    }
};
