const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const fetchBatches = async () => {
  const response = await fetch(`${API_URL}/api/batches`);
  return response.json();
};

export const registerBatch = async (data: any) => {
  const response = await fetch(`${API_URL}/api/batches/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const verifyBatch = async (batchId: string) => {
  const response = await fetch(`${API_URL}/api/batches/verify/${batchId}`, {
    method: 'POST',
  });
  return response.json();
};

export const analyzeBatch = async (batchId: string, data: any) => {
  const response = await fetch(`${API_URL}/api/counterfeit/analyze/${batchId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const generateQRCode = async (data: any) => {
  const response = await fetch(`${API_URL}/api/counterfeit/qrcode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getSupplyChain = async (batchId: string) => {
  const response = await fetch(`${API_URL}/api/counterfeit/supply-chain/${batchId}`);
  return response.json();
};

export const getBatchById = async (batchId: string) => {
  const response = await fetch(`${API_URL}/api/batches/${batchId}`);
  return response.json();
};
