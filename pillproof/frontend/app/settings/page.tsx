'use client';

import Header from '@/app/components/Header';
import { useState } from 'react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@pharma.com',
    phone: '+1-555-0123',
    company: 'Pharma Corp Ltd',
    role: 'Manufacturer',
    address: '123 Main Street',
    city: 'New York',
    country: 'USA',
    zipCode: '10001',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    batchUpdates: true,
    paymentAlerts: true,
    systemUpdates: false,
    weeklyReport: true,
    dailyReport: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    loginAlerts: true,
    unknownDeviceAlert: true,
    sessionTimeout: '30',
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'Private',
    activityLog: true,
    dataCollection: true,
    thirdPartyAccess: false,
  });

  const [saved, setSaved] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'twoFactorEnabled' || name === 'loginAlerts' || name === 'unknownDeviceAlert') {
      setSecuritySettings(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setSecuritySettings(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'activityLog' || name === 'dataCollection' || name === 'thirdPartyAccess') {
      setPrivacySettings(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setPrivacySettings(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-slate-900 dark:to-slate-800">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Settings
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Manage your account, preferences, and security settings
          </p>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 rounded-lg">
            <p className="text-green-700 dark:text-green-300 font-semibold">✅ Settings saved successfully!</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            👤 Profile
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'notifications'
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            🔔 Notifications
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            🔒 Security
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            🛡️ Privacy
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'about'
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            ℹ️ About
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile Picture</h2>
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-5xl">
                  👤
                </div>
                <button className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition mb-2">
                  📷 Upload Photo
                </button>
                <button className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition">
                  🗑️ Remove
                </button>
              </div>
            </div>

            {/* Profile Information */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile Information</h2>
              <form className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                    />
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                    />
                  </div>
                </div>

                {/* Company and Role */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={profileData.company}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={profileData.role}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                  />
                </div>

                {/* City, Country, Zip */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={profileData.city}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={profileData.country}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={profileData.zipCode}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
                >
                  💾 Save Profile
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📧 Email Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="emailAlerts"
                      checked={notificationSettings.emailAlerts}
                      onChange={handleNotificationChange}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 text-gray-700 dark:text-gray-300">Receive email alerts for important updates</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="paymentAlerts"
                      checked={notificationSettings.paymentAlerts}
                      onChange={handleNotificationChange}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 text-gray-700 dark:text-gray-300">Receive payment notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="batchUpdates"
                      checked={notificationSettings.batchUpdates}
                      onChange={handleNotificationChange}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 text-gray-700 dark:text-gray-300">Receive batch status updates</span>
                  </label>
                </div>
              </div>

              {/* SMS Notifications */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📱 SMS Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="smsAlerts"
                      checked={notificationSettings.smsAlerts}
                      onChange={handleNotificationChange}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 text-gray-700 dark:text-gray-300">Receive SMS alerts for urgent issues</span>
                  </label>
                </div>
              </div>

              {/* Push Notifications */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🔔 Push Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="pushNotifications"
                      checked={notificationSettings.pushNotifications}
                      onChange={handleNotificationChange}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 text-gray-700 dark:text-gray-300">Receive push notifications</span>
                  </label>
                </div>
              </div>

              {/* Reports */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Reports</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="dailyReport"
                      checked={notificationSettings.dailyReport}
                      onChange={handleNotificationChange}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 text-gray-700 dark:text-gray-300">Receive daily reports</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="weeklyReport"
                      checked={notificationSettings.weeklyReport}
                      onChange={handleNotificationChange}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 text-gray-700 dark:text-gray-300">Receive weekly reports</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="systemUpdates"
                      checked={notificationSettings.systemUpdates}
                      onChange={handleNotificationChange}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 text-gray-700 dark:text-gray-300">Receive system update notifications</span>
                  </label>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition shadow-lg hover:shadow-xl mt-6"
              >
                💾 Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Security Settings</h2>
            <div className="space-y-8">
              {/* Two-Factor Authentication */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🔐 Two-Factor Authentication</h3>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="twoFactorEnabled"
                      checked={securitySettings.twoFactorEnabled}
                      onChange={handleSecurityChange}
                      className="w-4 h-4"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add an extra layer of security to your account by requiring a code from your phone when you log in.
                </p>
                <button className="mt-4 px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition font-semibold">
                  📱 Set Up 2FA
                </button>
              </div>

              {/* Login Alerts */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="loginAlerts"
                    checked={securitySettings.loginAlerts}
                    onChange={handleSecurityChange}
                    className="w-4 h-4"
                  />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">Get alerts when someone logs into your account</span>
                </label>
              </div>

              {/* Unknown Device Alert */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="unknownDeviceAlert"
                    checked={securitySettings.unknownDeviceAlert}
                    onChange={handleSecurityChange}
                    className="w-4 h-4"
                  />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">Alert me when logging in from unknown devices</span>
                </label>
              </div>

              {/* Session Timeout */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Session Timeout (minutes)
                </label>
                <select
                  name="sessionTimeout"
                  value={securitySettings.sessionTimeout}
                  onChange={handleSecurityChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
              >
                💾 Save Security Settings
              </button>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Privacy Settings</h2>
            <div className="space-y-8">
              {/* Profile Visibility */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profile Visibility
                </label>
                <select
                  name="profileVisibility"
                  value={privacySettings.profileVisibility}
                  onChange={handlePrivacyChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                >
                  <option value="Public">Public - Everyone can see my profile</option>
                  <option value="Private">Private - Only connections can see my profile</option>
                  <option value="Hidden">Hidden - No one can see my profile</option>
                </select>
              </div>

              {/* Activity Log */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="activityLog"
                    checked={privacySettings.activityLog}
                    onChange={handlePrivacyChange}
                    className="w-4 h-4"
                  />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">Allow activity log tracking</span>
                </label>
              </div>

              {/* Data Collection */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="dataCollection"
                    checked={privacySettings.dataCollection}
                    onChange={handlePrivacyChange}
                    className="w-4 h-4"
                  />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">Allow data collection for analytics</span>
                </label>
              </div>

              {/* Third Party Access */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="thirdPartyAccess"
                    checked={privacySettings.thirdPartyAccess}
                    onChange={handlePrivacyChange}
                    className="w-4 h-4"
                  />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">Allow third-party applications to access my data</span>
                </label>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition shadow-lg hover:shadow-xl mt-6"
              >
                💾 Save Privacy Settings
              </button>
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* About PillProof */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About PillProof</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Application Version</p>
                  <p className="font-semibold text-gray-900 dark:text-white">1.0.0</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Build Number</p>
                  <p className="font-semibold text-gray-900 dark:text-white">20240403-001</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                  <p className="font-semibold text-gray-900 dark:text-white">April 3, 2024</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Blockchain Network</p>
                  <p className="font-semibold text-gray-900 dark:text-white">Algorand Mainnet</p>
                </div>
                <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900 rounded-lg">
                  <p className="text-sm text-indigo-700 dark:text-indigo-300">
                    PillProof is a blockchain-based medicine supply chain verification system using Algorand for secure, transparent, and tamper-proof tracking.
                  </p>
                </div>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Help & Support</h2>
              <div className="space-y-4">
                <button className="w-full px-4 py-3 bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800 transition font-semibold text-left">
                  📚 View Documentation
                </button>
                <button className="w-full px-4 py-3 bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800 transition font-semibold text-left">
                  ❓ FAQ
                </button>
                <button className="w-full px-4 py-3 bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800 transition font-semibold text-left">
                  💬 Contact Support
                </button>
                <button className="w-full px-4 py-3 bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800 transition font-semibold text-left">
                  🐛 Report Bug
                </button>
              </div>

              {/* Danger Zone */}
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4">⚠️ Danger Zone</h3>
                <button className="w-full px-4 py-3 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-800 transition font-semibold">
                  🗑️ Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}