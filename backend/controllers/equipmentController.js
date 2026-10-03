const Equipment = require('../models/Equipment');

// Task 1: GET /api/equipment
const getEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find({});
    res.status(200).json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Task 1: POST /api/equipment
const createEquipment = async (req, res) => {
  try {
    const { name, category, dailyRate, securityDeposit, imageUrl, description } = req.body;
    const equipment = await Equipment.create({
      name, category, dailyRate, securityDeposit, imageUrl, description
    });
    res.status(201).json(equipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getEquipment, createEquipment };