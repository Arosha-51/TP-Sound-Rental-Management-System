const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalFee: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Active', 'Completed'], 
    default: 'Pending' 
  },
  actualReturnDate: { type: Date, default: null },
  lateFee: { type: Number, default: 0 },
  damageCharges: { type: Number, default: 0 },
  netRefund: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);