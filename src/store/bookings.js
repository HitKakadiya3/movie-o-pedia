import { defineStore } from "pinia";

export const useBookingsStore = defineStore("bookings", {
    state: () => ({
        // Initialize from localStorage (persists across browser sessions)
        bookings: JSON.parse(localStorage.getItem("bookings") || "[]"),
        currentBooking: {
            movieId: null,
            movieTitle: null,
            theatre: null,
            showtime: null,
            seats: [],
            bookingDate: null
        }
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
        }
    },

    actions: {
        // Set current booking details (during booking flow)
        setCurrentBooking(bookingData) {
            this.currentBooking = {
                ...this.currentBooking,
                ...bookingData
            };
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
        }
    }
});
