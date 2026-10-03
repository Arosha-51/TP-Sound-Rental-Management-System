const express = require('express');
const router = express.Router();
const { createBooking, getBookings, updateBookingStatus } = require('../controllers/bookingController');

router.route('/').get(getBookings).post(createBooking);
router.route('/:id/status').put(updateBookingStatus);

module.exports = router;