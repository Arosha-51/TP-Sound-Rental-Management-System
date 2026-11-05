const express = require('express');
const router = express.Router();
const multer = require('multer'); // 👈 අලුතෙන් එකතු කළා
const path = require('path');

// File Save වෙන තැන සහ නම හදන්න
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // අපි හදපු uploads ෆෝල්ඩර් එකට
  },
  filename: (req, file, cb) => {
    // ෆයිල් එකේ නම unique වෙන්න අලුත් නමක් දෙනවා
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

const {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment
} = require('../controllers/equipmentController');

router.route('/')
  .get(getEquipment)
  .post(upload.single('image'), createEquipment); // 👈 upload.single('image') එකතු කළා

router.route('/:id')
  .get(getEquipmentById)
  .put(upload.single('image'), updateEquipment) // 👈 Edit කරද්දීත් image එකක් එන්න පුළුවන් නිසා
  .delete(deleteEquipment);

module.exports = router;