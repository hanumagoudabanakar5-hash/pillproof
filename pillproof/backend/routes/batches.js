const express = require('express');
const router = express.Router();
const BlockchainService = require('../services/blockchainService');
const ContractService = require('../services/contractService');

let batches = [];
let batchIdCounter = 1;

router.get('/', (req, res) => {
  res.json({ success: true, batches });
});

router.post('/register', async (req, res) => {
  try {
    const { medicineName, manufacturer, quantity, expiryDate } = req.body;

    if (!medicineName || !manufacturer || !quantity || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const batchId = `REG-2024-${String(batchIdCounter).padStart(3, '0')}`;
    batchIdCounter++;

    const blockchainResult = await BlockchainService.registerBatch({
      batchId,
      medicineName,
      manufacturer,
      quantity,
      expiryDate,
    });

    const contractResult = await ContractService.deployBatchContract({
      batchId,
      medicineName,
      manufacturer,
      quantity,
      expiryDate,
    });

    const newBatch = {
      id: batches.length + 1,
      batchId,
      medicineName,
      manufacturer,
      quantity,
      expiryDate,
      status: 'Pending',
      blockchainHash: blockchainResult.blockchainHash,
      blockchainTxn: blockchainResult.txnId,
      contractId: contractResult.appId,
      contractAddress: contractResult.contractAddress,
      registeredAt: new Date(),
    };

    batches.push(newBatch);

    res.status(201).json({
      success: true,
      message: 'Batch registered with smart contract',
      batch: newBatch,
      blockchain: blockchainResult,
      contract: contractResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering batch',
      error: error.message,
    });
  }
});

router.post('/verify/:batchId', async (req, res) => {
  try {
    const { batchId } = req.params;
    const batch = batches.find(b => b.batchId === batchId);
    
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
    }

    const blockchainResult = await BlockchainService.verifyBatch(batchId);
    const contractResult = await ContractService.verifyBatchContract(batch.contractId, batchId);

    batch.status = 'Verified';
    batch.verifiedAt = new Date();

    res.json({
      success: true,
      message: 'Batch verified via smart contract',
      batch,
      blockchain: blockchainResult,
      contract: contractResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying batch',
      error: error.message,
    });
  }
});

router.get('/:batchId', (req, res) => {
  const batch = batches.find(b => b.batchId === req.params.batchId);
  
  if (!batch) {
    return res.status(404).json({
      success: false,
      message: 'Batch not found',
    });
  }

  res.json({ success: true, batch });
});

router.get('/:batchId/contract', async (req, res) => {
  try {
    const { batchId } = req.params;
    const batch = batches.find(b => b.batchId === batchId);
    
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
    }

    const contractState = await ContractService.getContractState(batch.contractId);

    res.json({
      success: true,
      batch: batchId,
      contractId: batch.contractId,
      contractState: contractState.state,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting contract state',
      error: error.message,
    });
  }
});

module.exports = router;
