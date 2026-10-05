const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');
const User = require('../models/User');

// ============================================
// TASK 4 + 5 + 6: Create Booking
// TASK 2: Double-Booking Prevention
// TASK 3: Availability Check
// BUG FIX: Date validation (no negative totalFee)
// BUG FIX: ObjectId validation (invalid ID format)
// ============================================
const createBooking = async (req, res) => {
  try {
    const { customerId, equipmentId, startDate, endDate } = req.body;

    // ===== VALIDATION: Check required fields =====
    if (!startDate || !endDate) {
      return res.status(400).json({
        message: 'Start date and End date are required',
      });
    }

    if (!customerId || !equipmentId) {
      return res.status(400).json({
        message: 'Customer ID and Equipment ID are required',
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // ===== VALIDATION: Check valid dates =====
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        message: 'Invalid date format',
      });
    }

    // ===== VALIDATION: End date must be after Start date =====
    if (start >= end) {
      return res.status(400).json({
        message: 'End date must be after Start date',
      });
    }

    // ===== VALIDATION: Equipment ID must be valid ObjectId =====
    if (!mongoose.Types.ObjectId.isValid(equipmentId)) {
      return res.status(400).json({
        message: 'Invalid Equipment ID format',
      });
    }

    // ===== VALIDATION: Customer ID must be valid ObjectId =====
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({
        message: 'Invalid Customer ID format',
      });
    }

    // ===== Check if equipment exists =====
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // ===== TASK 2: DOUBLE-BOOKING PREVENTION LOGIC =====
    const conflictingBooking = await Booking.findOne({
      equipmentId: equipmentId,
      status: { $in: ['Pending', 'Approved', 'Active'] },
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
    });

    // ===== TASK 3: AVAILABILITY CHECK =====
    if (conflictingBooking) {
      return res.status(400).json({
        message: 'Equipment is already booked for these dates!',
        conflict: conflictingBooking.bookingId,
      });
    }

    // ===== TASK 5: TOTAL RENTAL FEE CALCULATION =====
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const totalFee = equipment.dailyRate * days + equipment.securityDeposit;

    // ===== TASK 6: UNIQUE BOOKING ID GENERATION =====
    const currentYear = new Date().getFullYear();
    const count = await Booking.countDocuments();
    const bookingId = `#TP-${currentYear}-${String(count + 1).padStart(3, '0')}`;

    const booking = await Booking.create({
      bookingId,
      customerId,
      equipmentId,
      startDate: start,
      endDate: end,
      totalFee,
    });

    res.status(201).json(booking);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// ============================================
// Get all bookings
// ============================================
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('customerId', 'name email phone')
      .populate('equipmentId', 'name dailyRate category');
    res.status(200).json(bookings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// TASK 7: APPROVE/REJECT BOOKING
// ============================================
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // ===== VALIDATION: Booking ID format =====
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid Booking ID format',
      });
    }

    // ===== VALIDATION: Status value =====
    const validStatuses = ['Pending', 'Approved', 'Rejected', 'Active', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status value',
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    // If approved, mark equipment as Rented
    if (status === 'Approved') {
      await Equipment.findByIdAndUpdate(booking.equipmentId, {
        status: 'Rented',
      });
    }

    // If completed, mark equipment as Available
    if (status === 'Completed') {
      await Equipment.findByIdAndUpdate(booking.equipmentId, {
        status: 'Available',
      });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createBooking, getBookings, updateBookingStatus };