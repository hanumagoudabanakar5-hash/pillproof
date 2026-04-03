'use client';

import { useState } from 'react';

interface TimelineEvent {
  stage: string;
  location: string;
  date: string;
  status: string;
  handler: string;
}

interface TrackingData {
  batchId: string;
  timeline: TimelineEvent[];
  currentLocation: string;
  totalSteps: number;
  completed: number;
}

export default function DashboardPage() {
  const [batchId, setBatchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [tracking, setTracking] = useState<TrackingData | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/counterfeit/supply-chain/${batchId}`
      );
      const data = await response.json();
      setTracking(data.tracking);
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Supply Chain Dashboard</h1>

      <form onSubmit={handleTrack} style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
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
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </div>
      </form>

      {tracking && (
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
        }}>
          <h2>Supply Chain Timeline</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '20px',
            marginBottom: '30px',
          }}>
            <div style={{
              backgroundColor: '#e7f3ff',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center',
            }}>
              <p>Current Location</p>
              <h3>{tracking.currentLocation}</h3>
            </div>

            <div style={{
              backgroundColor: '#e8f5e9',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center',
            }}>
              <p>Progress</p>
              <h3>{tracking.completed}/{tracking.totalSteps}</h3>
            </div>

            <div style={{
              backgroundColor: '#fff3e0',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center',
            }}>
              <p>Batch ID</p>
              <h3>{tracking.batchId}</h3>
            </div>
          </div>

          {tracking.timeline.map((event, idx) => (
            <div key={idx} style={{
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              borderLeft: '4px solid ' + (event.status.includes('Complete') ? '#28a745' : '#ffc107'),
            }}>
              <h3>{event.stage} {event.status}</h3>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Handler:</strong> {event.handler}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
