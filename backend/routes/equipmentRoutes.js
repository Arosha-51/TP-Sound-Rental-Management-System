const express = require('express');
const router = express.Router();
const {
  getEquipment,
  getEquipmentById,
  createEquipment,
} = require('../controllers/equipmentController');

// GET /api/equipment  → All equipment
// POST /api/equipment → Create equipment
router.route('/').get(getEquipment).post(createEquipment);

// GET /api/equipment/:id → Single equipment
router.route('/:id').get(getEquipmentById);

module.exports = router;