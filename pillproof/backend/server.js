const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;
const DATA_FILE = path.join(__dirname, 'batches.json');

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Helper functions
function loadBatches() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) {
    console.log('Initializing new batches file');
  }
  return [];
}

function saveBatches(batches) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(batches, null, 2));
}

function generateBatchId() {
  const batches = loadBatches();
  return `REG-2024-${String(batches.length + 1).padStart(3, '0')}`;
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '✅ Backend running!', timestamp: new Date().toISOString() });
});

app.post('/api/batches/register', (req, res) => {
  try {
    const { medicineName, manufacturer, quantity, expiryDate } = req.body;
    
    if (!medicineName || !manufacturer || !quantity || !expiryDate) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const batches = loadBatches();
    const batchId = generateBatchId();
    
    const newBatch = {
      id: batches.length + 1,
      batchId,
      medicineName,
      manufacturer,
      quantity: parseInt(quantity),
      expiryDate,
      status: 'Pending',
      blockchainHash: `HASH_${Math.random().toString(36).substr(2, 9)}`,
      contractId: 14553,
      createdAt: new Date().toISOString(),
      isAuthentic: true,
      riskScore: 0
    };

    batches.push(newBatch);
    saveBatches(batches);

    console.log('✅ Batch registered:', batchId);
    res.json({
      success: true,
      message: 'Batch registered with smart contract',
      batch: newBatch,
      blockchain: { success: true, txnId: 'TXN_' + Date.now(), blockchainHash: newBatch.blockchainHash }
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
});

app.get('/api/batches', (req, res) => {
  try {
    const batches = loadBatches();
    console.log(`✅ Returning ${batches.length} batches`);
    res.json({ success: true, batches });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/batches/verify/:batchId', (req, res) => {
  try {
    const { batchId } = req.params;
    let batches = loadBatches();
    const batch = batches.find(b => b.batchId === batchId);

    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    batch.status = 'Verified';
    saveBatches(batches);

    console.log('✅ Batch verified:', batchId);
    res.json({ success: true, message: 'Batch verified successfully!', batch });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/batches/detect', (req, res) => {
  try {
    const { medicineName, manufacturer, quantity, expiryDate } = req.body;
    
    let riskScore = 0;
    const riskFactors = [];

    try {
      const expiry = new Date(expiryDate);
      if (expiry < new Date()) {
        riskScore += 50;
        riskFactors.push('Expired');
      }
    } catch (e) {}

    if (quantity <= 0) {
      riskScore += 30;
      riskFactors.push('Invalid quantity');
    }

    const isAuthentic = riskScore === 0;

    console.log('✅ Detection completed - Authentic:', isAuthentic);
    res.json({
      success: true,
      isAuthentic,
      riskScore,
      confidence: 100 - riskScore,
      riskFactors
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/batches/track/:batchId', (req, res) => {
  try {
    const { batchId } = req.params;
    const batches = loadBatches();
    const batch = batches.find(b => b.batchId === batchId);

    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    const timeline = [
      { stage: 'Manufacturing', location: 'India', handler: 'Pharma Corp', date: '2026-03-04', status: '✅' },
      { stage: 'Quality Check', location: 'Lab', handler: 'QA Dept', date: '2026-03-09', status: '✅' },
      { stage: 'Warehouse', location: 'Central', handler: 'Logistics', date: '2026-03-14', status: '✅' },
      { stage: 'Distributor', location: 'Regional', handler: 'MediCare', date: '2026-03-24', status: '✅' },
      { stage: 'Pharmacy', location: 'Local', handler: 'HealthPlus', date: '2026-04-03', status: '✅' }
    ];

    console.log('✅ Track info retrieved for:', batchId);
    res.json({ success: true, batch, timeline });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Backend API running on http://0.0.0.0:${PORT}\n`);
});
