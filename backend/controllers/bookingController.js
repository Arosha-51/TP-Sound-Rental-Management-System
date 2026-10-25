const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');
const User = require('../models/User');
const PDFDocument = require('pdfkit');
const path = require('path');

// ============================================
// 1. CREATE BOOKING
// ============================================
const createBooking = async (req, res) => {
  try {
    const { customerId, equipmentId, startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and End date are required' });
    }

    if (!customerId || !equipmentId) {
      return res.status(400).json({ message: 'Customer ID and Equipment ID are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    if (start >= end) {
      return res.status(400).json({ message: 'End date must be after Start date' });
    }

    if (!mongoose.Types.ObjectId.isValid(equipmentId)) {
      return res.status(400).json({ message: 'Invalid Equipment ID format' });
    }

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: 'Invalid Customer ID format' });
    }

    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // Double-Booking Prevention
    const conflictingBooking = await Booking.findOne({
      equipmentId: equipmentId,
      status: { $in: ['Pending', 'Approved', 'Active'] },
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
    });

    if (conflictingBooking) {
      return res.status(400).json({
        message: 'Equipment is already booked for these dates!',
        conflict: conflictingBooking.bookingId,
      });
    }

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const totalFee = equipment.dailyRate * days + equipment.securityDeposit;

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
// 2. GET ALL BOOKINGS
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
// 3. UPDATE BOOKING STATUS (Approve/Reject)
// ============================================
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Booking ID format' });
    }

    const validStatuses = ['Pending', 'Approved', 'Rejected', 'Active', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    if (status === 'Approved') {
      await Equipment.findByIdAndUpdate(booking.equipmentId, { status: 'Rented' });
    }

    if (status === 'Completed') {
      await Equipment.findByIdAndUpdate(booking.equipmentId, { status: 'Available' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// ============================================
// 4. GENERATE PDF CONTRACT
// ============================================
const generatePdfContract = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerId')
      .populate('equipmentId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Contract-${booking.bookingId}.pdf`);
    doc.pipe(res);

    // Header
    try {
      doc.image(path.join(__dirname, '../assets/logo.png'), 50, 45, { width: 70 });
    } catch (err) {
      console.log("Logo not found, skipping...");
    }

    doc.fontSize(22).font('Helvetica-Bold').fillColor('#0f172a').text('T.P. SOUND & MUSICAL GEAR', 140, 50);
    doc.fontSize(12).font('Helvetica').fillColor('#64748b').text('Kuruwita, Sri Lanka | Contact: 071-XXXXXXX', 140, 75);

    doc.moveTo(50, 120).lineTo(550, 120).lineWidth(2).strokeColor('#43B062').stroke();

    doc.fontSize(16).font('Helvetica-Bold').fillColor('#000000').text('EQUIPMENT RENTAL AGREEMENT', 50, 150, { align: 'center', underline: true });
    doc.moveDown(2);

    const detailsY = 200;

    // Customer Details
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#0f172a').text('Customer Details:', 50, detailsY);
    doc.fontSize(10).font('Helvetica').fillColor('#333333');
    doc.text(`Name  : ${booking.customerId?.name || 'N/A'}`, 50, detailsY + 20);
    doc.text(`NIC   : ${booking.customerId?.nic || 'N/A'}`, 50, detailsY + 35);
    doc.text(`Phone : ${booking.customerId?.phone || 'N/A'}`, 50, detailsY + 50);

    // Rental Details
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#0f172a').text('Rental Details:', 350, detailsY);
    doc.fontSize(10).font('Helvetica').fillColor('#333333');
    doc.text(`Booking ID : ${booking.bookingId}`, 350, detailsY + 20);
    doc.text(`Start Date : ${new Date(booking.startDate).toLocaleDateString()}`, 350, detailsY + 35);
    doc.text(`End Date   : ${new Date(booking.endDate).toLocaleDateString()}`, 350, detailsY + 50);

    doc.moveDown(4);

    // Table
    const tableTop = 300;
    doc.rect(50, tableTop, 500, 25).fill('#f1f5f9');
   
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#0f172a');
    doc.text('Equipment', 60, tableTop + 8);
    doc.text('Code', 250, tableTop + 8);
    doc.text('Daily Rate', 350, tableTop + 8);
    doc.text('Total Fee', 450, tableTop + 8);

    doc.fontSize(10).font('Helvetica').fillColor('#333333');
    doc.text(booking.equipmentId?.name || 'N/A', 60, tableTop + 35, { width: 180 });
    doc.text(booking.equipmentId?.equipmentCode || 'N/A', 250, tableTop + 35);
    doc.text(`LKR ${booking.equipmentId?.dailyRate || 0}`, 350, tableTop + 35);
    doc.text(`LKR ${booking.totalFee}`, 450, tableTop + 35);

    doc.moveTo(50, tableTop + 60).lineTo(550, tableTop + 60).lineWidth(1).strokeColor('#cbd5e1').stroke();

    // Financial Summary
    const summaryY = tableTop + 80;
    doc.rect(300, summaryY, 250, 80).lineWidth(1).strokeColor('#43B062').stroke();
   
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#0f172a');
    doc.text('Security Deposit :', 310, summaryY + 15);
    doc.text(`LKR ${booking.securityDeposit || 5000}`, 450, summaryY + 15, { align: 'right', width: 90 });

    doc.text('Total Rental Fee :', 310, summaryY + 35);
    doc.text(`LKR ${booking.totalFee}`, 450, summaryY + 35, { align: 'right', width: 90 });

    doc.text('Total Advance :', 310, summaryY + 55);
    doc.text(`LKR ${booking.totalFee + (booking.securityDeposit || 5000)}`, 450, summaryY + 55, { align: 'right', width: 90 });

    // Terms
    const termsY = summaryY + 120;
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#0f172a').text('Terms & Conditions:', 50, termsY);
   
    doc.fontSize(9).font('Helvetica').fillColor('#64748b');
    doc.text('1. The equipment must be returned on or before the agreed end date.', 50, termsY + 20);
    doc.text('2. Late returns will be subject to a penalty based on the daily rate.', 50, termsY + 35);
    doc.text('3. The customer is liable for any damage or loss of the equipment.', 50, termsY + 50);
    doc.text('4. The security deposit will be refunded after deducting any penalties.', 50, termsY + 65);

    // Signatures
    const signY = 650;
    doc.moveTo(50, signY).lineTo(200, signY).lineWidth(1).strokeColor('#000000').stroke();
    doc.moveTo(350, signY).lineTo(500, signY).stroke();

    doc.fontSize(10).font('Helvetica').fillColor('#000000');
    doc.text('Proprietor Signature', 50, signY + 10);
    doc.text('Customer Signature', 350, signY + 10);

    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
};

// ============================================
// 5. PROCESS CHECK-IN (Calculate Late Fee & Net Refund)
// ============================================
const checkInBooking = async (req, res) => {
  try {
    const { damageCharges } = req.body;
    const bookingId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: 'Invalid Booking ID format' });
    }

    const booking = await Booking.findById(bookingId).populate('equipmentId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const endDate = new Date(booking.endDate);
    const actualReturnDate = new Date();
   
    const timeDiff = actualReturnDate.getTime() - endDate.getTime();
    const overdueDays = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));

    const dailyRate = booking.equipmentId ? booking.equipmentId.dailyRate : 0;
    const lateFee = overdueDays * dailyRate;

    const deposit = booking.securityDeposit || 5000;
    const damage = Number(damageCharges) || 0;
    const netRefund = deposit - lateFee - damage;

    booking.actualReturnDate = actualReturnDate;
    booking.lateFee = lateFee;
    booking.damageCharges = damage;
    booking.netRefund = netRefund;
    booking.status = 'Completed';
    await booking.save();

    await Equipment.findByIdAndUpdate(booking.equipmentId._id, { status: 'Available' });

    res.status(200).json({
      message: 'Check-In successful',
      data: {
        bookingId: booking.bookingId,
        overdueDays,
        lateFee,
        damage,
        netRefund,
        status: booking.status
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// 6. TRACK BOOKING (GET BY CUSTOM BOOKING ID)
// ============================================
// 👇 මේක තමයි අලුතෙන් එකතු කළේ 👇
const trackBooking = async (req, res) => {
  try {
    let searchId = req.params.bookingId;
    
    // Frontend එකෙන් # ලකුණ අයින් කරලා එව්වොත්, ආයෙත් # එක එකතු කරනවා DB එකේ තියෙන විදියට හොයන්න
    if (!searchId.startsWith('#')) {
      searchId = '#' + searchId;
    }

    const booking = await Booking.findOne({ bookingId: searchId })
      .populate('customerId', 'name email phone')
      .populate('equipmentId', 'name dailyRate category imageUrl');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found. Please check your ID.' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// EXPORTS
// ============================================
module.exports = {
  createBooking,
  getBookings,
  updateBookingStatus,
  generatePdfContract,
  checkInBooking,
  trackBooking // 👈 මේකත් එකතු කළා
};