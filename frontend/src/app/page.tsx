"use client";
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Package, Activity, AlertTriangle, CheckCircle, Search, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = "https://miniature-eureka-v67jrxv6vxjg2pjvg-8000.app.github.dev"; 

export default function PillProofDashboard() {
  const [activeTab, setActiveTab] = useState('manufacturer');
  const [batchId, setBatchId] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrImage, setQrImage] = useState(null);
  const [allBatches, setAllBatches] = useState([]);

  // Function to fetch all batches for Regulator and Alerts tabs
  const loadAllBatches = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/batches`);
      setAllBatches(res.data);
    } catch (e) { 
      console.error("Failed to load data from backend"); 
    }
  };

  // Load data whenever we switch to Regulator or Alerts tabs
  useEffect(() => {
    if (activeTab === 'regulator' || activeTab === 'alerts') {
      loadAllBatches();
    }
  }, [activeTab]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setQrImage(null);
    try {
      const formData = new FormData(e.target);
      const data = {
        batch_id: formData.get('batchId'),
        medicine_name: formData.get('medName'),
        quantity: parseInt(formData.get('qty')),
        manufacturer: formData.get('manufacturer'),
      };
      const res = await axios.post(`${API_BASE_URL}/register`, data);
      setQrImage(res.data.qr_code);
      alert("✅ Batch Registered Successfully on Algorand & IPFS!");
    } catch (error) {
      alert("❌ Registration failed!");
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    if (!batchId) return alert("Please enter a Batch ID");
    setLoading(true);
    setVerifyResult(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/verify/${batchId}`);
      setVerifyResult(response.data);
    } catch (error) {
      alert("❌ Connection Error!");
    }
    setLoading(false);
  };

  const reportCounterfeit = async () => {
    if (!verifyResult) return;
    if (confirm(`Report ${verifyResult.batch_id} as counterfeit? This will freeze it on-chain.`)) {
      try {
        await axios.post(`${API_BASE_URL}/report-counterfeit?batch_id=${verifyResult.batch_id}`);
        alert("🚩 Batch Reported! It will now appear in the Alerts Portal.");
        setVerifyResult(null);
      } catch (e) { alert("Error reporting counterfeit"); }
    }
  };

  const transferBatch = async (id, currentStage) => {
    const stages = ["Manufactured", "With Distributor", "With Pharmacy", "Delivered"];
    const nextStage = stages[stages.indexOf(currentStage) + 1] || "Delivered";
    try {
      await axios.post(`${API_BASE_URL}/update-stage`, { batch_id: id, new_stage: nextStage });
      loadAllBatches(); // Refresh the list
      alert(`Batch moved to ${nextStage}`);
    } catch (e) { alert("Transfer failed"); }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <div className="fixed left-0 top-0 h-full w-64 bg-slate-800 border-r border-slate-700 p-6 shadow-2xl z-50">
        <h1 className="text-2xl font-bold text-green-400 flex items-center gap-2 mb-10">
          <ShieldCheck size={32} /> PillProof
        </h1>
        <nav className="space-y-4">
          {[
            { id: 'manufacturer', label: 'Manufacturer', icon: <Package size={20}/> },
            { id: 'pharmacist', label: 'Pharmacist', icon: <CheckCircle size={20}/> },
            { id: 'regulator', label: 'CDSCO Regulator', icon: <Activity size={20}/> },
            { id: 'alerts', label: 'Counterfeit Alerts', icon: <AlertTriangle size={20}/> },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === tab.id ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'text-slate-400 hover:bg-slate-700'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="ml-64 p-10">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-bold capitalize">{activeTab} Portal</h2>
            <p className="text-slate-400">Autonomous Procurement Agent System</p>
          </div>
          <div className="bg-slate-800 px-4 py-2 rounded-full border border-slate-700 text-sm font-mono text-green-400">
            ● Algorand Testnet Connected
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {activeTab === 'manufacturer' && (
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Package className="text-blue-400" /> Register New Medicine Batch
              </h3>
              <form onSubmit={handleRegister} className="space-y-4">
                <input name="batchId" className="w-full p-3 bg-slate-900 rounded border border-slate-600 outline-none focus:border-green-500" placeholder="Batch ID" required />
                <input name="medName" className="w-full p-3 bg-slate-900 rounded border border-slate-600 outline-none focus:border-green-500" placeholder="Medicine Name" required />
                <input name="qty" className="w-full p-3 bg-slate-900 rounded border border-slate-600 outline-none focus:border-green-500" type="number" placeholder="Quantity" required />
                <input name="manufacturer" className="w-full p-3 bg-slate-900 rounded border border-slate-600 outline-none focus:border-green-500" placeholder="Manufacturer Name" required />
                <button className="w-full py-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-all flex justify-center items-center gap-2">
                  {loading ? <Loader2 className="animate-spin" /> : 'Mint ASA & Generate QR'}
                </button>
              </form>
              {qrImage && (
                <div className="mt-8 flex flex-col items-center p-4 bg-white rounded-xl shadow-2xl">
                  <img src={qrImage} alt="Medicine QR" className="w-48 h-48" />
                  <p className="text-black font-bold mt-2">Official Batch QR Code</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'pharmacist' && (
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Search className="text-green-400" /> Verify Medicine Authenticity
              </h3>
              <div className="flex gap-4 mb-8">
                <input 
                  className="flex-1 p-3 bg-slate-900 rounded border border-slate-600 outline-none focus:border-green-500" 
                  placeholder="Enter Batch ID..." 
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                />
                <button onClick={handleVerify} className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2">
                  {loading ? <Loader2 className="animate-spin" /> : 'Verify'}
                </button>
              </div>
              {verifyResult && (
                <div className={`p-6 rounded-xl border-l-8 shadow-inner transition-all ${verifyResult.verified ? 'bg-slate-900 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
                  <p className={`${verifyResult.verified ? 'text-green-400' : 'text-red-400'} font-bold text-xl mb-1`}>
                    STATUS: {verifyResult.status.toUpperCase()}
                  </p>
                  <p className="text-slate-400 text-sm">Medicine: {verifyResult.medicine || 'Unknown'}</p>
                  <p className="text-slate-400 text-sm">Manufacturer: {verifyResult.manufacturer || 'Unknown'}</p>
                  <p className="text-slate-400 text-sm italic">{verifyResult.alert}</p>
                  {verifyResult.verified && (
                    <button onClick={reportCounterfeit} className="mt-4 px-4 py-2 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-all">
                      🚩 Report as Counterfeit
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'regulator' && (
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Activity className="text-red-400" /> Live Supply Chain Map
              </h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {allBatches.length === 0 ? <p className="text-slate-500">No batches registered yet.</p> : 
                  allBatches.map((batch, i) => (
                    <div key={i} className="flex justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
                      <div>
                        <p className="font-bold">{batch.medicine_name}</p>
                        <p className="text-xs text-slate-500">{batch.batch_id} | {batch.manufacturer}</p>
                        <p className="text-xs text-blue-400 font-mono">{batch.current_stage}</p>
                      </div>
                      <button onClick={() => transferBatch(batch.batch_id, batch.current_stage)} className="p-2 bg-slate-700 rounded hover:bg-slate-600 text-white">
                        <ArrowRight size={16}/>
                      </button>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
              <h3 className="text-xl font-semibold mb-6 text-red-400 flex items-center gap-2">
                <AlertTriangle /> Counterfeit Alerts
              </h3>
              <div className="space-y-4">
                {allBatches.filter(b => !b.is_genuine).length === 0 ? <p className="text-slate-500">No active counterfeit alerts. All batches are genuine.</p> : 
                  allBatches.filter(b => !b.is_genuine).map((batch, i) => (
                    <div key={i} className="p-6 bg-red-900/20 border border-red-500/50 rounded-xl animate-pulse">
                      <div className="flex items-center gap-3 text-red-400 mb-2 font-bold">
                        CRITICAL ALERT: {batch.batch_id}
                      </div>
                      <p className="text-slate-300 text-sm">
                        Medicine {batch.medicine_name} detected as counterfeit. The associated ARC-3 ASA has been frozen on-chain automatically.
                      </p>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
