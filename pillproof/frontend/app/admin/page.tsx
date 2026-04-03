'use client';

import Header from '@/app/components/Header';
import { useState } from 'react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview');
  const [users] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@pharma.com',
      role: 'Manufacturer',
      status: 'Active',
      joinDate: '2024-01-15',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@distributor.com',
      role: 'Distributor',
      status: 'Active',
      joinDate: '2024-02-10',
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike@pharmacy.com',
      role: 'Pharmacy',
      status: 'Inactive',
      joinDate: '2024-01-20',
    },
    {
      id: 4,
      name: 'Emily Wilson',
      email: 'emily@regulator.com',
      role: 'Regulator',
      status: 'Active',
      joinDate: '2024-03-05',
    },
  ]);

  const [alerts] = useState([
    {
      id: 1,
      type: 'Counterfeit Detected',
      severity: 'Critical',
      message: 'Suspicious batch detected in New York',
      date: '2024-04-03',
      resolved: false,
    },
    {
      id: 2,
      type: 'Temperature Breach',
      severity: 'High',
      message: 'Storage temperature exceeded limit',
      date: '2024-04-02',
      resolved: false,
    },
    {
      id: 3,
      type: 'Expiry Warning',
      severity: 'Medium',
      message: 'Batch approaching expiry date',
      date: '2024-04-01',
      resolved: true,
    },
    {
      id: 4,
      type: 'Missing Documentation',
      severity: 'High',
      message: 'Required documents not submitted',
      date: '2024-03-31',
      resolved: true,
    },
  ]);

  const [systemStats] = useState({
    totalUsers: 142,
    activeUsers: 128,
    totalBatches: 1024,
    verifiedBatches: 892,
    failedTransactions: 5,
    totalRevenue: '$125,480',
    serverUptime: '99.8%',
    apiCalls: '2.4M',
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
      case 'High':
        return 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300';
      case 'Medium':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
      case 'Low':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'Inactive':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
      default:
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Admin Panel
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            System management, user control, and security monitoring
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            👥 Users
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'alerts'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            🚨 Alerts & Issues
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            ⚙️ Settings
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="text-4xl mb-2">👥</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{systemStats.totalUsers}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 12 this week</p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{systemStats.activeUsers}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">90.1% online</p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="text-4xl mb-2">📦</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Batches</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{systemStats.totalBatches}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">87.1% verified</p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="text-4xl mb-2">💰</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{systemStats.totalRevenue}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 15% this month</p>
              </div>
            </div>

            {/* System Health */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Server Uptime</p>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400">{systemStats.serverUptime}</p>
                <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '99.8%' }}></div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">API Calls</p>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{systemStats.apiCalls}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Last 30 days</p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Failed Transactions</p>
                <p className="text-4xl font-bold text-red-600 dark:text-red-400">{systemStats.failedTransactions}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Requires attention</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">New user registered</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">John Smith joined as Manufacturer</p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">5 min ago</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Payment processed</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Transaction TXN-2024-008 completed</p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">23 min ago</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Alert resolved</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Counterfeit batch issue resolved</p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
                <button className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-gray-100 transition">
                  ➕ Add User
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-slate-700 border-b border-gray-200 dark:border-gray-600">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Join Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600 dark:text-gray-400">{user.joinDate}</p>
                      </td>
                      <td className="px-6 py-4">
                        <button className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition font-semibold text-xs mr-2">
                          Edit
                        </button>
                        <button className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition font-semibold text-xs">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-red-50 dark:bg-red-900 rounded-xl shadow-lg p-6 border border-red-200 dark:border-red-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Critical</p>
                <p className="text-4xl font-bold text-red-600 dark:text-red-400">1</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900 rounded-xl shadow-lg p-6 border border-orange-200 dark:border-orange-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">High</p>
                <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">2</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900 rounded-xl shadow-lg p-6 border border-yellow-200 dark:border-yellow-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Medium</p>
                <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">1</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900 rounded-xl shadow-lg p-6 border border-green-200 dark:border-green-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Resolved</p>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400">2</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">All Alerts</h2>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-6 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{alert.type}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{alert.message}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{alert.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!alert.resolved && (
                        <button className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition font-semibold text-xs">
                          ✓ Mark Resolved
                        </button>
                      )}
                      {alert.resolved && (
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs font-semibold">
                          ✓ Resolved
                        </span>
                      )}
                      <button className="px-3 py-1 bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-500 transition font-semibold text-xs">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* System Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">System Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    System Name
                  </label>
                  <input
                    type="text"
                    placeholder="PillProof"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    placeholder="admin@pillproof.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    API Rate Limit
                  </label>
                  <input
                    type="number"
                    placeholder="10000"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="ml-3 text-gray-700 dark:text-gray-300">Enable Maintenance Mode</span>
                  </label>
                </div>

                <button className="w-full px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-gray-100 transition">
                  💾 Save Settings
                </button>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Security Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="ml-3 text-gray-700 dark:text-gray-300">Enable Two-Factor Authentication</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="ml-3 text-gray-700 dark:text-gray-300">Enable SSL/TLS</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="ml-3 text-gray-700 dark:text-gray-300">Enable Backup</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    placeholder="30"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <button className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition">
                  🔄 Reset System
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}