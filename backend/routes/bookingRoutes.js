const express = require('express');
const router = express.Router();

const {
    createBooking,
    getBookings,
    updateBookingStatus,
    generatePdfContract,
    checkInBooking,
    trackBooking,
    getDashboardStats,
    getUpcomingReturns,
    getChartData,
    searchBookingForCheckIn // 👈 අලුතෙන් එකතු කළා
} = require('../controllers/bookingController');

// ============================================
// 1. STATIC & SPECIFIC ROUTES (මේවා අනිවාර්යයෙන්ම /:id වලට උඩින් තියෙන්න ඕනේ)
// ============================================
router.get('/stats/dashboard', getDashboardStats);
router.get('/stats/upcoming-returns', getUpcomingReturns);
router.get('/stats/charts', getChartData);
router.get('/track/:bookingId', trackBooking);
router.get('/search', searchBookingForCheckIn); // 👈 මේක උඩට ගත්තා

// ============================================
// 2. GENERAL ROUTES (GET all & POST)
// ============================================
router.route('/')
    .get(getBookings)
    .post(createBooking);

// ============================================
// 3. PARAMETERIZED ROUTES (:id තියෙන ඒවා)
// ============================================
// PUT (Approve/Reject කරන්න)
router.put('/:id/status', updateBookingStatus);

// PUT (Check-In කරන්න)
router.put('/:id/check-in', checkInBooking);

// GET (PDF Contract එක හදන්න)
router.get('/:id/contract', generatePdfContract);

module.exports = router;