const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    batches: [
      {
        id: 1,
        batchId: 'REG-2024-001',
        medicineName: 'Aspirin',
        manufacturer: 'Pharma Corp Ltd',
        quantity: 10000,
        expiryDate: '2025-12-31',
        status: 'Verified',
      },
    ],
  });
});

router.post('/register', (req, res) => {
  try {
    const { batchId, medicineName, manufacturer, quantity, expiryDate } = req.body;

    if (!batchId || !medicineName || !manufacturer || !quantity || !expiryDate) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    res.json({
      success: true,
      message: 'Batch registered successfully',
      batch: {
        batchId,
        medicineName,
        manufacturer,
        quantity,
        expiryDate,
        status: 'Pending Verification',
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/verify/:batchId', (req, res) => {
  try {
    const { batchId } = req.params;

    res.json({
      success: true,
      message: 'Batch verified successfully',
      batch: {
        batchId,
        status: 'Verified',
        verifiedAt: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
