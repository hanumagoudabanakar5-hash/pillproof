'use client';

import Header from '@/app/components/Header';
import { useState } from 'react';

export default function Payment() {
  const [paymentData, setPaymentData] = useState({
    orderId: '',
    amount: '',
    paymentMethod: 'Credit Card',
    walletAddress: '',
    algorandAmount: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      transactionId: 'TXN-2024-001',
      orderId: 'PO-2024-001',
      amount: '$5,000',
      algoAmount: '500 ALGO',
      method: 'Algorand Blockchain',
      status: 'Completed',
      date: '2024-04-01',
      time: '10:30 AM',
    },
    {
      id: 2,
      transactionId: 'TXN-2024-002',
      orderId: 'PO-2024-002',
      amount: '$2,500',
      algoAmount: '250 ALGO',
      method: 'Credit Card',
      status: 'Completed',
      date: '2024-04-02',
      time: '2:45 PM',
    },
    {
      id: 3,
      transactionId: 'TXN-2024-003',
      orderId: 'PO-2024-003',
      amount: '$4,000',
      algoAmount: '400 ALGO',
      method: 'Bank Transfer',
      status: 'Processing',
      date: '2024-04-03',
      time: '11:15 AM',
    },
    {
      id: 4,
      transactionId: 'TXN-2024-004',
      orderId: 'PO-2024-004',
      amount: '$7,500',
      algoAmount: '750 ALGO',
      method: 'Algorand Blockchain',
      status: 'Completed',
      date: '2024-03-28',
      time: '9:00 AM',
    },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Payment submitted:', paymentData);
    setSubmitted(true);
    setTimeout(() => {
      setPaymentData({
        orderId: '',
        amount: '',
        paymentMethod: 'Credit Card',
        walletAddress: '',
        algorandAmount: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
      });
      setSubmitted(false);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'Processing':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
      case 'Failed':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
      case 'Pending':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Payment
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Process payments using traditional methods or Algorand blockchain
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-2">💰</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Payments</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">${transactions.reduce((sum, t) => sum + parseInt(t.amount.replace('$', '').replace(',', '')), 0).toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {transactions.filter(t => t.status === 'Completed').length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-2">⏳</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Processing</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {transactions.filter(t => t.status === 'Processing').length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-2">⛓️</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">ALGO Payments</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {transactions.filter(t => t.method === 'Algorand Blockchain').length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Make Payment</h2>

            {submitted && (
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 rounded-lg">
                <p className="text-green-700 dark:text-green-300 font-semibold text-sm">✅ Payment processed successfully!</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Order ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Order ID *
                </label>
                <input
                  type="text"
                  name="orderId"
                  value={paymentData.orderId}
                  onChange={handleChange}
                  placeholder="e.g., PO-2024-001"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount ($) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={paymentData.amount}
                  onChange={handleChange}
                  placeholder="e.g., 5000"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Method *
                </label>
                <select
                  name="paymentMethod"
                  value={paymentData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                >
                  <option value="Credit Card">💳 Credit Card</option>
                  <option value="Bank Transfer">🏦 Bank Transfer</option>
                  <option value="Algorand Blockchain">⛓️ Algorand Blockchain</option>
                </select>
              </div>

              {/* Conditional Fields */}
              {paymentData.paymentMethod === 'Credit Card' && (
                <>
                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                    />
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Expiry *
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={paymentData.expiryDate}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        CVV *
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={paymentData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentData.paymentMethod === 'Algorand Blockchain' && (
                <>
                  {/* Wallet Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Wallet Address *
                    </label>
                    <input
                      type="text"
                      name="walletAddress"
                      value={paymentData.walletAddress}
                      onChange={handleChange}
                      placeholder="Your Algorand wallet address"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                    />
                  </div>

                  {/* Algorand Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ALGO Amount *
                    </label>
                    <input
                      type="number"
                      name="algorandAmount"
                      value={paymentData.algorandAmount}
                      onChange={handleChange}
                      placeholder="e.g., 500"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                    />
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      💡 1 ALGO ≈ $0.10 (Exchange rate is approximate)
                    </p>
                  </div>
                </>
              )}

              {/* Buttons */}
              <div className="space-y-2 pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
                >
                  💳 Process Payment
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

          {/* Transaction History */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Transaction History</h2>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="p-6 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-lg transition">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{transaction.transactionId}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.date} at {transaction.time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Order ID</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{transaction.orderId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Amount (USD)</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{transaction.amount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Amount (ALGO)</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{transaction.algoAmount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Method</p>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{transaction.method}</p>
                    </div>
                  </div>

                  {/* Receipt Button */}
                  <button className="w-full px-3 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition font-semibold text-sm">
                    📄 Download Receipt
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Methods */}
          <div className="bg-green-50 dark:bg-green-900 rounded-xl shadow-lg p-6 border border-green-200 dark:border-green-700">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">💳 Payment Methods</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li>✓ <span className="font-semibold">Credit Card</span> - Instant processing</li>
              <li>✓ <span className="font-semibold">Bank Transfer</span> - 1-2 business days</li>
              <li>✓ <span className="font-semibold">Algorand Blockchain</span> - Decentralized and secure</li>
            </ul>
          </div>

          {/* Security & Benefits */}
          <div className="bg-blue-50 dark:bg-blue-900 rounded-xl shadow-lg p-6 border border-blue-200 dark:border-blue-700">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">🔒 Security & Benefits</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li>✓ <span className="font-semibold">SSL Encryption</span> - Your data is protected</li>
              <li>✓ <span className="font-semibold">Blockchain Audit Trail</span> - Immutable records</li>
              <li>✓ <span className="font-semibold">Smart Contracts</span> - Automated verification</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}