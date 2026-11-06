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
    getChartData  // 👈 අලුතෙන් එකතු කළා
} = require('../controllers/bookingController');

// ============================================
// 1. STATS ROUTES (මේවා අනිවාර්යයෙන්ම /:id වලට උඩින් තියෙන්න ඕනේ)
// ============================================
router.get('/stats/dashboard', getDashboardStats);
router.get('/stats/upcoming-returns', getUpcomingReturns);


// ============================================
// 2. TRACK BOOKING ROUTE (මේකත් /:id වලට උඩින් තියෙන්න ඕනේ)
// ============================================
router.get('/track/:bookingId', trackBooking);

// ============================================
// 3. GENERAL ROUTES (GET all & POST)
// ============================================
router.route('/')
    .get(getBookings)
    .post(createBooking);

// ============================================
// 4. PARAMETERIZED ROUTES (:id තියෙන ඒවා)
// ============================================
// PUT (Approve/Reject කරන්න)
router.put('/:id/status', updateBookingStatus);

// PUT (Check-In කරන්න)
router.put('/:id/check-in', checkInBooking);

// GET (PDF Contract එක හදන්න)
router.get('/:id/contract', generatePdfContract);

// GET (Chart Data)
router.get('/stats/charts', getChartData);

module.exports = router;