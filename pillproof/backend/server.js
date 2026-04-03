const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/batches', require('./routes/batches'));
app.use('/api/counterfeit', require('./routes/counterfeit'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '✅ Backend is running!',
    timestamp: new Date(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 http://localhost:${PORT}`);
  console.log(`💊 PillProof API ready!`);
});
