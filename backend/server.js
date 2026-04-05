/**
 * PillProof Backend Server
 * Blockchain-based medicine supply chain verification system
 * Express.js API with JSON file storage
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 8000;

// Path to JSON data storage file
const DATA_FILE = path.join(__dirname, 'batches.json');

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ─── Helper: read / write JSON storage ───────────────────────────────────────

/**
 * Read all batches from JSON file.
 * Returns an empty array if the file is missing or corrupt.
 */
function readBatches() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading batches.json:', err.message);
    return [];
  }
}

/**
 * Persist batches array to JSON file.
 */
function writeBatches(batches) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(batches, null, 2));
}

/**
 * Generate the next sequential batch ID, e.g. PILL-2026-00001
 */
function generateBatchId(batches) {
  const year = new Date().getFullYear();
  const seq = String(batches.length + 1).padStart(5, '0');
  return `PILL-${year}-${seq}`;
}

/**
 * Simulate a blockchain hash for a batch record.
 */
function generateBlockchainHash(data) {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'running' });
});

// POST /api/batches/register — register a new batch
app.post('/api/batches/register', (req, res) => {
  try {
    const { medicineName, manufacturer, quantity, expiryDate } = req.body;

    // Validate required fields
    if (!medicineName || !manufacturer || !quantity || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: medicineName, manufacturer, quantity, expiryDate',
      });
    }

    if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
      return res.status(400).json({ success: false, message: 'quantity must be a positive number' });
    }

    const batches = readBatches();
    const batchId = generateBatchId(batches);

    const newBatch = {
      id: batches.length + 1,
      batchId,
      medicineName: medicineName.trim(),
      manufacturer: manufacturer.trim(),
      quantity: Number(quantity),
      expiryDate,
      status: 'Pending Verification',
      verified: false,
      createdAt: new Date().toISOString(),
      blockchainHash: '', // filled below after object is built
    };

    newBatch.blockchainHash = generateBlockchainHash(newBatch);

    batches.push(newBatch);
    writeBatches(batches);

    console.log(`✅ Registered batch ${batchId}`);
    res.status(201).json({ success: true, message: 'Batch registered successfully', batch: newBatch });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// GET /api/batches — list all batches
app.get('/api/batches', (req, res) => {
  try {
    const batches = readBatches();
    res.json({ success: true, count: batches.length, batches });
  } catch (err) {
    console.error('List error:', err.message);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// GET /api/batches/:batchId — get a single batch
app.get('/api/batches/:batchId', (req, res) => {
  try {
    const batches = readBatches();
    const batch = batches.find((b) => b.batchId === req.params.batchId);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }
    res.json({ success: true, batch });
  } catch (err) {
    console.error('Get batch error:', err.message);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// POST /api/batches/:batchId/verify — verify a batch
app.post('/api/batches/:batchId/verify', (req, res) => {
  try {
    const batches = readBatches();
    const idx = batches.findIndex((b) => b.batchId === req.params.batchId);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    batches[idx].status = 'Verified';
    batches[idx].verified = true;
    batches[idx].verifiedAt = new Date().toISOString();
    // Re-hash after update
    batches[idx].blockchainHash = generateBlockchainHash(batches[idx]);

    writeBatches(batches);

    console.log(`✅ Verified batch ${req.params.batchId}`);
    res.json({ success: true, message: 'Batch verified successfully', batch: batches[idx] });
  } catch (err) {
    console.error('Verify error:', err.message);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// POST /api/batches/detect — detect counterfeit
app.post('/api/batches/detect', (req, res) => {
  try {
    const { batchId } = req.body;
    if (!batchId) {
      return res.status(400).json({ success: false, message: 'batchId is required' });
    }

    const batches = readBatches();
    const batch = batches.find((b) => b.batchId === batchId);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    // ── Risk scoring logic ──
    let riskScore = 0;
    const issues = [];

    // Check expiry date
    const now = new Date();
    const expiry = new Date(batch.expiryDate);
    const daysUntilExpiry = Math.floor((expiry - now) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      riskScore += 50;
      issues.push('Medicine has expired');
    } else if (daysUntilExpiry < 30) {
      riskScore += 30;
      issues.push('Medicine expires within 30 days');
    } else if (daysUntilExpiry < 90) {
      riskScore += 10;
      issues.push('Medicine expires within 90 days');
    }

    // Check quantity — unusually low quantities can signal tampering
    if (batch.quantity < 10) {
      riskScore += 30;
      issues.push('Suspiciously low quantity');
    } else if (batch.quantity < 100) {
      riskScore += 10;
      issues.push('Low quantity');
    }

    // Not verified adds risk
    if (!batch.verified) {
      riskScore += 20;
      issues.push('Batch has not been verified');
    }

    let riskLevel = 'Low';
    if (riskScore >= 60) riskLevel = 'High';
    else if (riskScore >= 30) riskLevel = 'Medium';

    res.json({
      success: true,
      batchId,
      riskScore,
      riskLevel,
      issues,
      isCounterfeit: riskScore >= 60,
      checkedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Detect error:', err.message);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// GET /api/batches/:batchId/track — supply chain journey
app.get('/api/batches/:batchId/track', (req, res) => {
  try {
    const batches = readBatches();
    const batch = batches.find((b) => b.batchId === req.params.batchId);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    // Build a supply-chain timeline based on batch data
    const timeline = [
      {
        stage: 'Manufacturing',
        status: 'Completed',
        timestamp: batch.createdAt,
        description: `Batch manufactured by ${batch.manufacturer}`,
        location: 'Manufacturing Plant',
      },
      {
        stage: 'Quality Control',
        status: batch.verified ? 'Completed' : 'Pending',
        timestamp: batch.verifiedAt || null,
        description: batch.verified ? 'Quality control passed' : 'Awaiting quality control inspection',
        location: 'QC Laboratory',
      },
      {
        stage: 'Packaging',
        status: batch.verified ? 'Completed' : 'Pending',
        timestamp: batch.verified ? batch.verifiedAt : null,
        description: batch.verified ? `${batch.quantity} units packaged` : 'Packaging pending verification',
        location: 'Packaging Unit',
      },
      {
        stage: 'Distribution',
        status: batch.verified ? 'In Progress' : 'Pending',
        timestamp: null,
        description: batch.verified ? 'Dispatched to regional distributors' : 'Distribution pending',
        location: 'Distribution Center',
      },
      {
        stage: 'Retail',
        status: 'Pending',
        timestamp: null,
        description: 'Awaiting arrival at retail pharmacies',
        location: 'Retail Pharmacy',
      },
    ];

    res.json({ success: true, batchId: batch.batchId, batch, timeline });
  } catch (err) {
    console.error('Track error:', err.message);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ─── 404 fallback ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 PillProof backend running on http://0.0.0.0:${PORT}`);
  console.log(`📦 Data file: ${DATA_FILE}`);
});
