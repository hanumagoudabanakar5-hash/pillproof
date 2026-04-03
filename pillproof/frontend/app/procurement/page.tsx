'use client';

import Header from '@/app/components/Header';
import { useState } from 'react';

export default function Procurement() {
  const [formData, setFormData] = useState({
    medicineName: '',
    quantity: '',
    manufacturer: '',
    expectedDelivery: '',
    priority: 'Normal',
    budget: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderId: 'PO-2024-001',
      medicineName: 'Aspirin',
      manufacturer: 'Pharma Corp Ltd',
      quantity: '10,000 units',
      budget: '$5,000',
      status: 'Confirmed',
      date: '2024-04-01',
      priority: 'High',
    },
    {
      id: 2,
      orderId: 'PO-2024-002',
      medicineName: 'Paracetamol',
      manufacturer: 'Health Pharma Inc',
      quantity: '5,000 units',
      budget: '$2,500',
      status: 'Processing',
      date: '2024-04-02',
      priority: 'Normal',
    },
    {
      id: 3,
      orderId: 'PO-2024-003',
      medicineName: 'Amoxicillin',
      manufacturer: 'Medicine Labs',
      quantity: '8,000 units',
      budget: '$4,000',
      status: 'Pending',
      date: '2024-04-03',
      priority: 'Normal',
    },
    {
      id: 4,
      orderId: 'PO-2024-004',
      medicineName: 'Ibuprofen',
      manufacturer: 'Relief Pharma',
      quantity: '15,000 units',
      budget: '$7,500',
      status: 'Shipped',
      date: '2024-03-28',
      priority: 'Low',
    },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Order submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        medicineName: '',
        quantity: '',
        manufacturer: '',
        expectedDelivery: '',
        priority: 'Normal',
        budget: '',
        notes: '',
      });
      setSubmitted(false);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'Processing':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
      case 'Shipped':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300';
      case 'Pending':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 dark:text-red-400';
      case 'Normal':
        return 'text-blue-600 dark:text-blue-400';
      case 'Low':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Procurement
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Manage and track medicine procurement orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-2">📦</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{orders.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Confirmed</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {orders.filter(o => o.status === 'Confirmed').length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-2">⏳</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Processing</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {orders.filter(o => o.status === 'Processing').length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-2">🚚</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Shipped</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {orders.filter(o => o.status === 'Shipped').length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Order Form */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Order</h2>

            {submitted && (
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 rounded-lg">
                <p className="text-green-700 dark:text-green-300 font-semibold text-sm">✅ Order created successfully!</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Medicine Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  name="medicineName"
                  value={formData.medicineName}
                  onChange={handleChange}
                  placeholder="e.g., Aspirin"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                />
              </div>

              {/* Manufacturer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Manufacturer *
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  placeholder="e.g., Pharma Corp"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quantity (units) *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="e.g., 10000"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Budget ($) *
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g., 5000"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority *
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Expected Delivery */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expected Delivery *
                </label>
                <input
                  type="date"
                  name="expectedDelivery"
                  value={formData.expectedDelivery}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add any additional notes..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="space-y-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
                >
                  📝 Create Order
                </button>
                <button
                  type="reset"
                  className="w-full bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
                >
                  🔄 Clear
                </button>
              </div>
            </form>
          </div>

          {/* Orders List */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Orders</h2>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {orders.map((order) => (
                <div key={order.id} className="p-6 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-lg transition">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{order.orderId}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{order.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Medicine</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{order.medicineName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Manufacturer</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{order.manufacturer}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Quantity</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{order.quantity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Budget</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{order.budget}</p>
                    </div>
                  </div>

                  {/* Priority and Action */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${getPriorityColor(order.priority)}`}>
                      Priority: {order.priority}
                    </span>
                    <button className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded hover:bg-indigo-200 dark:hover:bg-indigo-800 transition font-semibold text-xs">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-indigo-50 dark:bg-indigo-900 rounded-xl shadow-lg p-6 border border-indigo-200 dark:border-indigo-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">📋 Procurement Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <p className="font-semibold">✓ Verified Suppliers</p>
              <p className="text-xs">Only order from verified and registered suppliers</p>
            </div>
            <div>
              <p className="font-semibold">✓ Quality Assurance</p>
              <p className="text-xs">All orders undergo quality verification</p>
            </div>
            <div>
              <p className="font-semibold">✓ Budget Control</p>
              <p className="text-xs">Set budgets and track expenses efficiently</p>
            </div>
            <div>
              <p className="font-semibold">✓ Delivery Tracking</p>
              <p className="text-xs">Real-time tracking from order to delivery</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}