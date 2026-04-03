class CounterfeitService {
  static async analyzeBatch(batchData) {
    try {
      console.log('🔍 Analyzing batch for counterfeits...');
      
      const riskFactors = [];
      let riskScore = 0;

      // Check 1: Quantity validation
      if (batchData.quantity < 100 || batchData.quantity > 1000000) {
        riskFactors.push('Unusual quantity detected');
        riskScore += 15;
      }

      // Check 2: Expiry date validation
      const expiryDate = new Date(batchData.expiryDate);
      const today = new Date();
      const yearsUntilExpiry = (expiryDate - today) / (1000 * 60 * 60 * 24 * 365);
      
      if (yearsUntilExpiry < 0.5) {
        riskFactors.push('Expiry date too soon');
        riskScore += 20;
      }
      
      if (yearsUntilExpiry > 10) {
        riskFactors.push('Expiry date unusually far');
        riskScore += 10;
      }

      // Check 3: Batch ID format validation
      const batchIdRegex = /^REG-\d{4}-\d{3}$/;
      if (!batchIdRegex.test(batchData.batchId)) {
        riskFactors.push('Invalid batch ID format');
        riskScore += 25;
      }

      // Check 4: Manufacturer validation
      const knownManufacturers = ['Bayer', 'Pharma XYZ', 'Pharma Corp Ltd', 'Johnson & Johnson', 'Pfizer'];
      if (!knownManufacturers.some(m => batchData.manufacturer.toLowerCase().includes(m.toLowerCase()))) {
        riskFactors.push('Unknown manufacturer');
        riskScore += 30;
      }

      // Check 5: Medicine name validation
      const knownMedicines = ['Aspirin', 'Paracetamol', 'Ibuprofen', 'Amoxicillin'];
      if (!knownMedicines.some(m => batchData.medicineName.toLowerCase().includes(m.toLowerCase()))) {
        riskFactors.push('Unknown medicine');
        riskScore += 20;
      }

      // Determine authenticity
      const isAuthentic = riskScore < 50;
      const status = isAuthentic ? 'AUTHENTIC' : 'SUSPICIOUS';

      return {
        success: true,
        batchId: batchData.batchId,
        isAuthentic,
        status,
        riskScore: Math.min(riskScore, 100),
        riskFactors,
        confidence: Math.max(0, 100 - riskScore),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('❌ Counterfeit analysis error:', error);
      throw error;
    }
  }

  static async generateQRCode(batchData) {
    try {
      console.log('📱 Generating QR code...');
      
      const qrData = {
        batchId: batchData.batchId,
        medicine: batchData.medicineName,
        manufacturer: batchData.manufacturer,
        expiry: batchData.expiryDate,
        contractId: batchData.contractId,
      };

      return {
        success: true,
        qrCode: 'data:image/png;base64,' + Buffer.from(JSON.stringify(qrData)).toString('base64'),
        qrData,
        verifyUrl: `http://localhost:3000/verify?batchId=${batchData.batchId}`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('❌ QR code generation error:', error);
      throw error;
    }
  }

  static async scanQRCode(qrData) {
    try {
      console.log('🔍 Scanning QR code...');
      
      return {
        success: true,
        decoded: qrData,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('❌ QR scan error:', error);
      throw error;
    }
  }

  static async trackSupplyChain(batchId) {
    try {
      console.log('📊 Tracking supply chain...');
      
      const timeline = [
        {
          stage: 'Manufacturing',
          location: 'India',
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: '✅ Complete',
          handler: 'Pharma Corp Ltd',
        },
        {
          stage: 'Quality Check',
          location: 'Quality Lab',
          date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          status: '✅ Complete',
          handler: 'QA Department',
        },
        {
          stage: 'Warehouse Storage',
          location: 'Central Warehouse',
          date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          status: '✅ Complete',
          handler: 'Logistics Co.',
        },
        {
          stage: 'Distributor',
          location: 'Regional Distributor',
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          status: '✅ Complete',
          handler: 'MediCare Distribution',
        },
        {
          stage: 'Retail Pharmacy',
          location: 'Local Pharmacy',
          date: new Date().toISOString(),
          status: '✅ Current',
          handler: 'HealthPlus Pharmacy',
        },
      ];

      return {
        success: true,
        batchId,
        timeline,
        currentLocation: timeline[timeline.length - 1].location,
        totalSteps: timeline.length,
        completed: timeline.filter(t => t.status === '✅ Complete').length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('❌ Supply chain tracking error:', error);
      throw error;
    }
  }
}

module.exports = CounterfeitService;
