const express = require('express');
const router = express.Router();

// Controller එකෙන් ඕන කරන ෆන්ක්ෂන්ස් ටික ඔක්කොම import කරගන්න
const {
    createBooking,
    getBookings,
    updateBookingStatus,
    generatePdfContract
} = require('../controllers/bookingController');

// 1. GET (ඔක්කොම bookings ගන්න) සහ POST (අලුත් booking එකක් හදන්න)
router.route('/')
    .get(getBookings)
    .post(createBooking);

// 2. PUT (Approve/Reject කරන්න)
router.route('/:id/status')
    .put(updateBookingStatus);

// 3. GET (PDF Contract එක හදන්න)
router.get('/:id/contract', generatePdfContract);

module.exports = router;