const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Guitars & Basses', 'Keyboards & Synth', 'Drums & Percussion', 'PA & Lighting']
  },
  dailyRate: { type: Number, required: true, min: 0 },
  securityDeposit: { type: Number, default: 5000, min: 0 },
  status: { 
    type: String, 
    enum: ['Available', 'Rented', 'Maintenance'], 
    default: 'Available' 
  },
  imageUrl: { type: String, default: '' },
  description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);