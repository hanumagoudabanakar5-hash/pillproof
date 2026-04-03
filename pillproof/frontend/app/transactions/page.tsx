'use client';

import Header from '@/app/components/Header';
import { useState } from 'react';

export default function Transactions() {
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [transactions] = useState([
    {
      id: 1,
      transactionId: 'TXN-2024-001',
      type: 'Payment',
      description: 'Payment for Order PO-2024-001',
      amount: '$5,000',
      algoAmount: '500 ALGO',
      status: 'Completed',
      date: '2024-04-01',
      time: '10:30 AM',
      orderId: 'PO-2024-001',
      from: 'Buyer Account',
      to: 'Seller Account',
    },
    {
      id: 2,
      transactionId: 'TXN-2024-002',
      type: 'Refund',
      description: 'Refund for cancelled order',
      amount: '$1,200',
      algoAmount: '120 ALGO',
      status: 'Completed',
      date: '2024-04-02',
      time: '2:45 PM',
      orderId: 'PO-2024-002',
      from: 'Seller Account',
      to: 'Buyer Account',
    },
    {
      id: 3,
      transactionId: 'TXN-2024-003',
      type: 'Transfer',
      description: 'Batch transfer payment',
      amount: '$2,500',
      algoAmount: '250 ALGO',
      status: 'Processing',
      date: '2024-04-03',
      time: '11:15 AM',
      orderId: 'PO-2024-003',
      from: 'Distributor A',
      to: 'Distributor B',
    },
    {
      id: 4,
      transactionId: 'TXN-2024-004',
      type: 'Payment',
      description: 'Payment for Order PO-2024-004',
      amount: '$7,500',
      algoAmount: '750 ALGO',
      status: 'Completed',
      date: '2024-03-28',
      time: '9:00 AM',
      orderId: 'PO-2024-004',
      from: 'Buyer Account',
      to: 'Seller Account',
    },
    {
      id: 5,
      transactionId: 'TXN-2024-005',
      type: 'Payment',
      description: 'Payment for Order PO-2024-005',
      amount: '$3,200',
      algoAmount: '320 ALGO',
      status: 'Failed',
      date: '2024-03-27',
      time: '3:20 PM',
      orderId: 'PO-2024-005',
      from: 'Buyer Account',
      to: 'Seller Account',
    },
    {
      id: 6,
      transactionId: 'TXN-2024-006',
      type: 'Transfer',
      description: 'Supply chain transfer settlement',
      amount: '$4,100',
      algoAmount: '410 ALGO',
      status: 'Completed',
      date: '2024-03-26',
      time: '1:10 PM',
      orderId: 'PO-2024-006',
      from: 'Pharmacy A',
      to: 'Warehouse B',
    },
    {
      id: 7,
      transactionId: 'TXN-2024-007',
      type: 'Refund',
      description: 'Partial refund due to quality issue',
      amount: '$800',
      algoAmount: '80 ALGO',
      status: 'Pending',
      date: '2024-03-25',
      time: '4:55 PM',
      orderId: 'PO-2024-007',
      from: 'Seller Account',
      to: 'Buyer Account',
    },
    {
      id: 8,
      transactionId: 'TXN-2024-008',
      type: 'Payment',
      description: 'Payment for Order PO-2024-008',
      amount: '$6,200',
      algoAmount: '620 ALGO',
      status: 'Completed',
      date: '2024-03-24',
      time: '8:30 AM',
      orderId: 'PO-2024-008',
      from: 'Buyer Account',
      to: 'Seller Account',
    },
  ]);

  const filteredTransactions = transactions.filter(tx => {
    const typeMatch = filterType === 'All' || tx.type === filterType;
    const statusMatch = filterStatus === 'All' || tx.status === filterStatus;
    const searchMatch = 
      tx.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && statusMatch && searchMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'Processing':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
      case 'Pending':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
      case 'Failed':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Payment':
        return '💳';
      case 'Refund':
        return '↩️';
      case 'Transfer':
        return '🔄';
      default:
        return '📊';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Payment':
        return 'text-blue-600 dark:text-blue-400';
      case 'Refund':
        return 'text-purple-600 dark:text-purple-400';
      case 'Transfer':
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const totalAmount = filteredTransactions.reduce((sum, tx) => {
    const amount = parseInt(tx.amount.replace('$', '').replace(',', ''));
    return sum + amount;
  }, 0);

  const completedCount = filteredTransactions.filter(tx => tx.status === 'Completed').length;
  const pendingCount = filteredTransactions.filter(tx => tx.status === 'Pending' || tx.status === 'Processing').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Transactions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            View and manage all supply chain transactions and payments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</p>
            <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{filteredTransactions.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-2">💰</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">${totalAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{completedCount}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-2">⏳</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{pendingCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID or Order..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
              >
                <option value="All">All Types</option>
                <option value="Payment">💳 Payment</option>
                <option value="Refund">↩️ Refund</option>
                <option value="Transfer">🔄 Transfer</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
              >
                <option value="All">All Status</option>
                <option value="Completed">✅ Completed</option>
                <option value="Processing">⏳ Processing</option>
                <option value="Pending">⏱️ Pending</option>
                <option value="Failed">❌ Failed</option>
              </select>
            </div>

            {/* Export Button */}
            <div className="flex items-end">
              <button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white px-4 py-2 rounded-lg font-semibold transition shadow-lg hover:shadow-xl">
                📥 Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-slate-700 border-b border-gray-200 dark:border-gray-600">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Transaction ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Amount (USD)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Amount (ALGO)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900 dark:text-white">{tx.transactionId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-lg ${getTypeColor(tx.type)}`}>{getTypeIcon(tx.type)} {tx.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{tx.description}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">{tx.orderId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900 dark:text-white">{tx.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-purple-600 dark:text-purple-400">{tx.algoAmount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{tx.date}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">{tx.time}</p>
                    </td>
                    <td className="px-6 py-4">
                      <button className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 rounded hover:bg-cyan-200 dark:hover:bg-cyan-800 transition font-semibold text-xs">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Transactions Found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold">{filteredTransactions.length}</span> of <span className="font-semibold">{transactions.length}</span> transactions
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition font-semibold">
              ← Previous
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition font-semibold">
              Next →
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-cyan-50 dark:bg-cyan-900 rounded-xl shadow-lg p-6 border border-cyan-200 dark:border-cyan-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">📋 Transaction Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <p className="font-semibold">✓ Real-time Updates</p>
              <p className="text-xs">All transactions are updated in real-time on the blockchain</p>
            </div>
            <div>
              <p className="font-semibold">✓ Immutable Records</p>
              <p className="text-xs">All records are permanently stored on the blockchain</p>
            </div>
            <div>
              <p className="font-semibold">✓ Secure & Transparent</p>
              <p className="text-xs">Every transaction is cryptographically verified and auditable</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}