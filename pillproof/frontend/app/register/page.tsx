'use client';

import { useState } from 'react';
import { registerBatch } from '@/lib/api';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    medicineName: '',
    manufacturer: '',
    quantity: '',
    expiryDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await registerBatch({
        ...formData,
        quantity: parseInt(formData.quantity),
      });
      setResult(data);
      if (data.success) {
        setFormData({
          medicineName: '',
          manufacturer: '',
          quantity: '',
          expiryDate: '',
        });
      }
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>💊 Register Medicine Batch</h1>
      
      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
      }}>
        <input
          type="text"
          name="medicineName"
          placeholder="Medicine Name"
          value={formData.medicineName}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
        />
        
        <input
          type="text"
          name="manufacturer"
          placeholder="Manufacturer"
          value={formData.manufacturer}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
        />
        
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
        />
        
        <input
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
        />
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          {loading ? '⏳ Registering...' : '✅ Register Batch'}
        </button>
      </form>

      {result && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: result.success ? '#d4edda' : '#f8d7da',
          borderRadius: '5px',
          color: result.success ? '#155724' : '#721c24',
          border: `2px solid ${result.success ? '#28a745' : '#dc3545'}`,
        }}>
          <h3>{result.success ? '✅ Success!' : '❌ Error'}</h3>
          {result.batch && (
            <div>
              <p><strong>Batch ID:</strong> {result.batch.batchId}</p>
              <p><strong>Medicine:</strong> {result.batch.medicineName}</p>
              <p><strong>Contract ID:</strong> {result.batch.contractId}</p>
            </div>
          )}
          {result.error && <p>{result.error}</p>}
        </div>
      )}
    </div>
  );
}
