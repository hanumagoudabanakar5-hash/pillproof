"use client";

import { useState } from "react";
import { createProcurementOrder, verifyAndPay } from "@/lib/api";
import { generateId } from "@/lib/utils";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import SuccessNotification from "../components/SuccessNotification";

interface Order {
  order_id: string;
  supplier_address: string;
  medicine_batch_id: string;
  payment_amount: number;
  status: string;
}

export default function ProcurementPage() {
  const [form, setForm] = useState({
    order_id: generateId("ORD"),
    supplier_address: "",
    medicine_batch_id: "",
    payment_amount: "",
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const payload = { ...form, payment_amount: parseInt(form.payment_amount, 10) };
      const res = await createProcurementOrder(payload);
      setSuccess(res.message ?? "Order placed successfully!");
      setOrders((prev) => [
        { ...payload, status: "PENDING" },
        ...prev,
      ]);
      setForm({
        order_id: generateId("ORD"),
        supplier_address: "",
        medicine_batch_id: "",
        payment_amount: "",
      });
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } }; message?: string };
      setError(err?.response?.data?.detail ?? err?.message ?? "Order failed");
    } finally {
      setLoading(false);
    }
  }

  async function handlePay(orderId: string, isGenuine: boolean) {
    try {
      const res = await verifyAndPay(orderId, isGenuine);
      setSuccess(res.message ?? "Payment updated!");
      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === orderId ? { ...o, status: res.status } : o
        )
      );
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } }; message?: string };
      setError(err?.response?.data?.detail ?? err?.message ?? "Payment action failed");
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">🛒 Procurement Orders</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Place and manage medicine procurement orders with escrow payments.
        </p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
      {success && <SuccessNotification message={success} onDismiss={() => setSuccess(null)} />}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 space-y-5">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">New Order</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Order ID</label>
            <input name="order_id" value={form.order_id} onChange={handleChange} required
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Supplier Address</label>
            <input name="supplier_address" value={form.supplier_address} onChange={handleChange} required
              placeholder="Algorand address"
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Batch ID</label>
            <input name="medicine_batch_id" value={form.medicine_batch_id} onChange={handleChange} required
              placeholder="e.g. BATCH-001"
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Payment (microALGO)</label>
            <input name="payment_amount" type="number" min="1" value={form.payment_amount} onChange={handleChange} required
              placeholder="e.g. 1000000"
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">
          {loading ? "Placing…" : "Place Order"}
        </button>
      </form>

      {loading && <LoadingSpinner message="Processing order…" />}

      {orders.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Order History</h2>
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.order_id} className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{order.order_id}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Batch: {order.medicine_batch_id} · {order.payment_amount.toLocaleString()} µALGO
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    order.status === "PAYMENT_RELEASED"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : order.status === "COUNTERFEIT_DETECTED"
                      ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}>
                    {order.status}
                  </span>
                </div>
                {order.status === "PENDING" && (
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handlePay(order.order_id, true)}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors">
                      ✅ Release Payment
                    </button>
                    <button onClick={() => handlePay(order.order_id, false)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors">
                      ❌ Block (Counterfeit)
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
