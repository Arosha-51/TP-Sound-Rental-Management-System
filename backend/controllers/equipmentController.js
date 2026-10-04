const Equipment = require('../models/Equipment');

// ============================================
// TASK 1: GET all equipment
// @route   GET /api/equipment
// ============================================
const getEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find({});
    res.status(200).json(equipment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// TASK 4 (NEW): GET single equipment by ID
// @route   GET /api/equipment/:id
// ============================================
const getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.status(200).json(equipment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// POST: Create new equipment
// @route   POST /api/equipment
// ============================================
const createEquipment = async (req, res) => {
  try {
    const { name, category, dailyRate, securityDeposit, imageUrl, description } = req.body;
    const equipment = await Equipment.create({
      name,
      category,
      dailyRate,
      securityDeposit,
      imageUrl,
      description,
    });
    res.status(201).json(equipment);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getEquipment, getEquipmentById, createEquipment };