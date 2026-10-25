const express = require('express');
const router = express.Router();

// Controller එකෙන් ඕන කරන ෆන්ක්ෂන්ස් ටික ඔක්කොම import කරගන්න
const {
    createBooking,
    getBookings,
    updateBookingStatus,
    generatePdfContract,
    checkInBooking,
    trackBooking // 👈 මේක අලුතෙන් එකතු කළා
} = require('../controllers/bookingController');

// 1. GET (ඔක්කොම bookings ගන්න) සහ POST (අලුත් booking එකක් හදන්න)
router.route('/')
    .get(getBookings)
    .post(createBooking);

// 2. TRACK BOOKING (මේක අනිවාර්යයෙන්ම /:id වලට උඩින් තියෙන්න ඕන) 👇
router.get('/track/:bookingId', trackBooking);

// 3. PUT (Approve/Reject කරන්න)
router.route('/:id/status')
    .put(updateBookingStatus);

// 4. GET (PDF Contract එක හදන්න)
router.get('/:id/contract', generatePdfContract);

// 5. PUT (Check-In කරන්න සහ Penalty හදන්න)
router.put('/:id/check-in', checkInBooking); 

module.exports = router;