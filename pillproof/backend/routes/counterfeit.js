const express = require('express');
const router = express.Router();
const CounterfeitService = require('../services/counterfeitService');
const BlockchainService = require('../services/blockchainService');

// Analyze batch for counterfeits
router.post('/analyze/:batchId', async (req, res) => {
  try {
    const { batchId } = req.params;
    const batchData = req.body;

    const analysisResult = await CounterfeitService.analyzeBatch({
      batchId,
      ...batchData,
    });

    res.json({
      success: true,
      analysis: analysisResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error analyzing batch',
      error: error.message,
    });
  }
});

// Generate QR Code
router.post('/qrcode', async (req, res) => {
  try {
    const { batchId, medicineName, manufacturer, expiryDate, contractId } = req.body;

    if (!batchId || !medicineName || !manufacturer) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const qrResult = await CounterfeitService.generateQRCode({
      batchId,
      medicineName,
      manufacturer,
      expiryDate,
      contractId,
    });

    res.json({
      success: true,
      qr: qrResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating QR code',
      error: error.message,
    });
  }
});

// Scan QR Code
router.post('/scan', async (req, res) => {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({
        success: false,
        message: 'Missing QR data',
      });
    }

    const scanResult = await CounterfeitService.scanQRCode(qrData);

    res.json({
      success: true,
      scan: scanResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error scanning QR code',
      error: error.message,
    });
  }
});

// Track supply chain
router.get('/supply-chain/:batchId', async (req, res) => {
  try {
    const { batchId } = req.params;

    const trackingResult = await CounterfeitService.trackSupplyChain(batchId);

    res.json({
      success: true,
      tracking: trackingResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error tracking supply chain',
      error: error.message,
    });
  }
});

module.exports = router;
