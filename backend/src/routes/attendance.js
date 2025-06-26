const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { v4: uuidv4 } = require('uuid');

router.post('/generate-qr', async (req, res) => {
  const qrCode = uuidv4();
  res.json({ qrCode });
});

router.post('/mark', async (req, res) => {
  const { qrCode } = req.body;
  // In a real app, validate student ID from auth token
  const studentId = 'STUDENT_' + Math.random().toString(36).substr(2, 9); // Demo purpose

  try {
    const attendance = new Attendance({ studentId, qrCode });
    await attendance.save();
    res.json({ message: 'Attendance marked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance' });
  }
});

router.get('/', async (req, res) => {
  const records = await Attendance.find().sort({ timestamp: -1 });
  res.json(records);
});

module.exports = router;