const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');

const createBooking = async (req, res) => {
  try {
    const { customerId, equipmentId, startDate, endDate } = req.body;

    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    const conflictingBooking = await Booking.findOne({
      equipmentId: equipmentId,
      status: { $in: ['Approved', 'Active'] },$or: [
        { startDate: { $lte: new Date(endDate) }, endDate: {$gte: new Date(startDate) } }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({ 
        message: 'Equipment is already booked for these dates!',
        conflict: conflictingBooking.bookingId
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const totalFee = (equipment.dailyRate * days) + equipment.securityDeposit;

    const currentYear = new Date().getFullYear();
    const count = await Booking.countDocuments();
    const bookingId = `#TP-${currentYear}-${String(count + 1).padStart(3, '0')}`;

    const booking = await Booking.create({
      bookingId, customerId, equipmentId, startDate, endDate, totalFee
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('customerId', 'name email phone')
      .populate('equipmentId', 'name dailyRate category');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    if (status === 'Approved') {
      await Equipment.findByIdAndUpdate(booking.equipmentId, { status: 'Rented' });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createBooking, getBookings, updateBookingStatus };