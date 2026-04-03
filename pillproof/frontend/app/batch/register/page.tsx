"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { registerBatch } from "@/lib/api";
import { generateId } from "@/lib/utils";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";
import SuccessNotification from "../../components/SuccessNotification";

export default function RegisterBatchPage() {
  const [form, setForm] = useState({
    batch_id: generateId("BATCH"),
    medicine_name: "",
    quantity: "",
    manufacture_date: "",
    expiry_date: "",
    manufacturer_address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [qrData, setQrData] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const payload = { ...form, quantity: parseInt(form.quantity, 10) };
      const res = await registerBatch(payload);
      setSuccess(res.message ?? "Batch registered successfully!");
      setQrData(JSON.stringify({ batch_id: form.batch_id, medicine_name: form.medicine_name }));
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } }; message?: string };
      setError(err?.response?.data?.detail ?? err?.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">📦 Register Medicine Batch</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Register a new medicine batch and generate its QR code on Algorand.
        </p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
      {success && <SuccessNotification message={success} onDismiss={() => setSuccess(null)} />}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Batch ID</label>
            <input name="batch_id" value={form.batch_id} onChange={handleChange} required
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Medicine Name</label>
            <input name="medicine_name" value={form.medicine_name} onChange={handleChange} required
              placeholder="e.g. Paracetamol 500mg"
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Quantity</label>
            <input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} required
              placeholder="e.g. 1000"
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Manufacture Date</label>
            <input name="manufacture_date" type="date" value={form.manufacture_date} onChange={handleChange} required
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Expiry Date</label>
            <input name="expiry_date" type="date" value={form.expiry_date} onChange={handleChange} required
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Manufacturer Address</label>
            <input name="manufacturer_address" value={form.manufacturer_address} onChange={handleChange} required
              placeholder="Algorand wallet address"
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">
          {loading ? "Registering…" : "Register Batch"}
        </button>
      </form>

      {loading && <LoadingSpinner message="Registering batch on Algorand…" />}

      {qrData && (
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 flex flex-col items-center gap-4">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Generated QR Code</h2>
          <QRCodeSVG value={qrData} size={200} />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Batch ID: {form.batch_id}</p>
        </div>
      )}
    </div>
  );
}
