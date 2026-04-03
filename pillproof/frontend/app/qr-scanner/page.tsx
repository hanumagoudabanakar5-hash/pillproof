'use client';

import { useState } from 'react';

interface QRResult {
  batchId: string;
  medicine: string;
  manufacturer: string;
  expiry: string;
  contractId: number;
}

export default function QRScannerPage() {
  const [batchId, setBatchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrData, setQrData] = useState<QRResult | null>(null);

  const handleGenerateQR = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const batchResponse = await fetch(`http://localhost:5000/api/batches/${batchId}`);
      const batchDataResult = await batchResponse.json();

      if (!batchDataResult.success) {
        alert('Batch not found');
        setLoading(false);
        return;
      }

      const batch = batchDataResult.batch;

      const response = await fetch('http://localhost:5000/api/counterfeit/qrcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchId: batch.batchId,
          medicineName: batch.medicineName,
          manufacturer: batch.manufacturer,
          expiryDate: batch.expiryDate,
          contractId: batch.contractId,
        }),
      });

      const data = await response.json();
      setQrCode(data.qr.qrCode);
      setQrData(data.qr.qrData);
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrCode) return;
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `qr-${batchId}.png`;
    link.click();
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>QR Code Scanner & Generator</h1>

      <form onSubmit={handleGenerateQR} style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '30px',
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Batch ID"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            required
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Generating...' : 'Generate QR'}
          </button>
        </div>
      </form>

      {qrCode && (
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          <h2>QR Code Generated</h2>
          
          <img
            src={qrCode}
            alt="QR Code"
            style={{
              width: '300px',
              height: '300px',
              margin: '20px 0',
              border: '2px solid #ddd',
              padding: '10px',
            }}
          />

          <button
            onClick={downloadQR}
            style={{
              padding: '12px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Download QR Code
          </button>

          {qrData && (
            <div style={{
              marginTop: '30px',
              backgroundColor: '#f9f9f9',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'left',
            }}>
              <h3>Batch Information</h3>
              <p><strong>Batch ID:</strong> {qrData.batchId}</p>
              <p><strong>Medicine:</strong> {qrData.medicine}</p>
              <p><strong>Manufacturer:</strong> {qrData.manufacturer}</p>
              <p><strong>Expiry:</strong> {qrData.expiry}</p>
              <p><strong>Contract:</strong> {qrData.contractId}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
