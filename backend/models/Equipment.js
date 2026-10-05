const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  equipmentCode: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Equipment name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Guitars & Basses',
      'Keyboards & Synth',
      'Drums & Percussion',
      'PA & Lighting',
    ],
  },
  dailyRate: {
    type: Number,
    required: [true, 'Daily rate is required'],
    min: 0,
  },
  securityDeposit: {
    type: Number,
    default: 5000,
    min: 0,
  },
  status: {
    type: String,
    enum: ['Available', 'Rented', 'Maintenance'],
    default: 'Available',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// ============================================
// Auto-generate equipmentCode before saving
// ============================================
equipmentSchema.pre('save', async function() {
  if (!this.equipmentCode) {
    const count = await mongoose.model('Equipment').countDocuments();
    this.equipmentCode = `EQ-${String(count + 1).padStart(3, '0')}`;
  }
});

module.exports = mongoose.model('Equipment', equipmentSchema);