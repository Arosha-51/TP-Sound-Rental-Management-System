const express = require('express');
const router = express.Router();
const { getEquipment, createEquipment } = require('../controllers/equipmentController');

router.route('/').get(getEquipment).post(createEquipment);

module.exports = router;