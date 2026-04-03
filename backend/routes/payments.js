const express = require('express');
const router = express.Router();

router.post('/process', (req, res) => {
  try {
    const { orderId, amount, paymentMethod } = req.body;

    if (!orderId || !amount || !paymentMethod) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    res.json({
      success: true,
      message: 'Payment processed successfully',
      transaction: {
        transactionId: 'TXN-' + Date.now(),
        orderId,
        amount,
        paymentMethod,
        status: 'Completed',
        timestamp: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
