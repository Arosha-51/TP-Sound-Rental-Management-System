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
// TASK 4: GET single equipment by ID
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
    const { name, category, dailyRate, securityDeposit, description } = req.body;
    
    // File එකක් ආවොත් ඒකේ URL එක හදනවා, නැත්නම් හිස්
    const imageUrl = req.file 
      ? `http://localhost:5000/uploads/${req.file.filename}` 
      : req.body.imageUrl;

    const equipment = await Equipment.create({
      name, category, dailyRate, securityDeposit, imageUrl, description,
    });
    res.status(201).json(equipment);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// ============================================
// PUT: Update existing equipment
// @route   PUT /api/equipment/:id
// ============================================
const updateEquipment = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // අලුත් ෆොටෝ එකක් ආවොත් ඒක update කරනවා
    if (req.file) {
      updateData.imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.status(200).json(equipment);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
// ============================================
// DELETE: Delete equipment
// @route   DELETE /api/equipment/:id
// ============================================
const deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.status(200).json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// EXPORTS
// ============================================
module.exports = { 
  getEquipment, 
  getEquipmentById, 
  createEquipment,
  updateEquipment,
  deleteEquipment
};