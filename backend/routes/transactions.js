const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    transactions: [
      {
        transactionId: 'TXN-2024-001',
        type: 'Payment',
        amount: 5000,
        status: 'Completed',
        date: '2024-04-01',
      },
      {
        transactionId: 'TXN-2024-002',
        type: 'Refund',
        amount: 1200,
        status: 'Completed',
        date: '2024-04-02',
      },
    ],
  });
});

module.exports = router;
