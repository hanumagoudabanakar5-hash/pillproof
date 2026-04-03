'use client';

import { useState, useEffect } from 'react';
import { fetchBatches, verifyBatch } from '@/lib/api';

interface Batch {
  id: number;
  batchId: string;
  medicineName: string;
  manufacturer: string;
  quantity: number;
  expiryDate: string;
  status: string;
  contractId: number;
}

export default function VerifyPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBatches();
    const interval = setInterval(loadBatches, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadBatches = async () => {
    try {
      setError(null);
      const data = await fetchBatches();
      if (data.success) {
        setBatches(data.batches);
      }
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (batchId: string) => {
    setVerifying(batchId);
    try {
      const data = await verifyBatch(batchId);
      if (data.success) {
        alert('✅ Batch Verified!');
        loadBatches();
      } else {
        alert('❌ Verification Failed');
      }
    } catch (err: any) {
      alert('❌ Error: ' + err.message);
    } finally {
      setVerifying(null);
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <h1>✅ Verify Medicine Batches</h1>
      
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
        }}>
          {error}
        </div>
      )}
      
      {loading ? (
        <p>⏳ Loading batches...</p>
      ) : batches.length === 0 ? (
        <p>📭 No batches found. Register a batch first!</p>
      ) : (
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <thead>
            <tr style={{ backgroundColor: '#282c34', color: 'white' }}>
              <th style={{ border: '1px solid #ddd', padding: '15px' }}>Batch ID</th>
              <th style={{ border: '1px solid #ddd', padding: '15px' }}>Medicine</th>
              <th style={{ border: '1px solid #ddd', padding: '15px' }}>Status</th>
              <th style={{ border: '1px solid #ddd', padding: '15px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch, idx) => (
              <tr key={batch.id} style={{ backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>
                <td style={{ border: '1px solid #ddd', padding: '15px' }}>{batch.batchId}</td>
                <td style={{ border: '1px solid #ddd', padding: '15px' }}>{batch.medicineName}</td>
                <td style={{ border: '1px solid #ddd', padding: '15px' }}>
                  <span style={{
                    padding: '6px 12px',
                    backgroundColor: batch.status === 'Verified' ? '#28a745' : '#ffc107',
                    color: 'white',
                    borderRadius: '20px',
                  }}>
                    {batch.status}
                  </span>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '15px' }}>
                  <button
                    onClick={() => handleVerify(batch.batchId)}
                    disabled={batch.status === 'Verified' || verifying === batch.batchId}
                    style={{
                      padding: '8px 15px',
                      backgroundColor: batch.status === 'Verified' ? '#ccc' : '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: batch.status === 'Verified' ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {verifying === batch.batchId ? '⏳ Verifying...' : 'Verify'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
