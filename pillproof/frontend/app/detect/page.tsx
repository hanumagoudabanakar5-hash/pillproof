'use client';

import { useState } from 'react';

interface AnalysisResult {
  isAuthentic: boolean;
  status: string;
  riskScore: number;
  confidence: number;
  riskFactors: string[];
}

export default function DetectPage() {
  const [batchId, setBatchId] = useState('');
  const [formData, setFormData] = useState({
    medicineName: '',
    manufacturer: '',
    quantity: '',
    expiryDate: '',
    contractId: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/counterfeit/analyze/${batchId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            quantity: parseInt(formData.quantity),
            contractId: parseInt(formData.contractId),
          }),
        }
      );

      const data = await response.json();
      setResult(data.analysis);
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Counterfeit Detection</h1>

      <form onSubmit={handleAnalyze} style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '30px',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <input
            type="text"
            placeholder="Batch ID"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            required
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          />

          <input
            type="text"
            name="medicineName"
            placeholder="Medicine Name"
            value={formData.medicineName}
            onChange={handleChange}
            required
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          />

          <input
            type="text"
            name="manufacturer"
            placeholder="Manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            required
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          />

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          />

          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            required
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          />

          <input
            type="number"
            name="contractId"
            placeholder="Contract ID"
            value={formData.contractId}
            onChange={handleChange}
            required
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: '15px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Analyzing...' : 'Analyze Batch'}
        </button>
      </form>

      {result && (
        <div style={{
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: result.isAuthentic ? '#d4edda' : '#f8d7da',
          border: `3px solid ${result.isAuthentic ? '#28a745' : '#dc3545'}`,
        }}>
          <h2 style={{ color: result.isAuthentic ? '#155724' : '#721c24' }}>
            {result.isAuthentic ? 'AUTHENTIC' : 'SUSPICIOUS'}
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginTop: '15px',
          }}>
            <div>
              <h3>Status</h3>
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{result.status}</p>
            </div>

            <div>
              <h3>Confidence: {result.confidence}%</h3>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                height: '30px',
              }}>
                <div style={{
                  width: `${result.confidence}%`,
                  backgroundColor: result.isAuthentic ? '#28a745' : '#dc3545',
                  height: '100%',
                }}>
                </div>
              </div>
            </div>

            <div>
              <h3>Risk Score: {result.riskScore}/100</h3>
            </div>

            <div>
              <h3>Risk Factors</h3>
              {result.riskFactors.length === 0 ? (
                <p>No risk factors detected</p>
              ) : (
                <ul>
                  {result.riskFactors.map((factor, idx) => (
                    <li key={idx}>{factor}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
