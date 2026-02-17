import React, { useState } from 'react';
import { Save, Bell, Shield, Mail, Phone, Globe, Users, FileText, CreditCard, Database } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Perfect Match Matrimony',
    contactEmail: 'admin@perfectmatch.com',
    supportPhone: '+91 98765 43210',
    autoApprove: false,
    photoVerification: true,
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
    allowRegistration: true,
    minimumAge: 18,
    maximumAge: 70,
    profileExpiryDays: 365,
    subscriptionRequired: false,
    freeProfileLimit: 5,
    premiumPrice: 999,
    dataRetentionDays: 730
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (field: string, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    // Simulate save
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              saved 
                ? 'bg-green-600 text-white' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Save size={20} />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="text-blue-600" size={24} />
              <h3 className="text-xl font-semibold text-gray-800">General Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Support Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="tel"
                    value={settings.supportPhone}
                    onChange={(e) => handleChange('supportPhone', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Approval & Verification */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-green-600" size={24} />
              <h3 className="text-xl font-semibold text-gray-800">Approval & Verification</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-sm font-medium text-gray-700">Auto-approve new profiles</span>
                  <p className="text-xs text-gray-500">Profiles go live immediately</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.autoApprove}
                    onChange={(e) => handleChange('autoApprove', e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-sm font-medium text-gray-700">Require photo verification</span>
                  <p className="text-xs text-gray-500">Verify profile photos manually</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.photoVerification}
                    onChange={(e) => handleChange('photoVerification', e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-sm font-medium text-gray-700">Allow registration</span>
                  <p className="text-xs text-gray-500">Enable new user signups</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.allowRegistration}
                    onChange={(e) => handleChange('allowRegistration', e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-sm font-medium text-gray-700">Maintenance mode</span>
                  <p className="text-xs text-gray-500">Disable site for users</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="text-purple-600" size={24} />
              <h3 className="text-xl font-semibold text-gray-800">Notifications</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-sm font-medium text-gray-700">Email notifications</span>
                  <p className="text-xs text-gray-500">Send admin alerts via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.emailNotifications}
                    onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-sm font-medium text-gray-700">SMS notifications</span>
                  <p className="text-xs text-gray-500">Send admin alerts via SMS</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.smsNotifications}
                    onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-orange-600" size={24} />
              <h3 className="text-xl font-semibold text-gray-800">User Management</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Age</label>
                <input
                  type="number"
                  value={settings.minimumAge}
                  onChange={(e) => handleChange('minimumAge', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Age</label>
                <input
                  type="number"
                  value={settings.maximumAge}
                  onChange={(e) => handleChange('maximumAge', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Expiry (Days)</label>
                <input
                  type="number"
                  value={settings.profileExpiryDays}
                  onChange={(e) => handleChange('profileExpiryDays', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Inactive profiles will be hidden</p>
              </div>
            </div>
          </div>

          {/* Subscription Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="text-pink-600" size={24} />
              <h3 className="text-xl font-semibold text-gray-800">Subscription Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-sm font-medium text-gray-700">Require subscription</span>
                  <p className="text-xs text-gray-500">Mandatory for profile access</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.subscriptionRequired}
                    onChange={(e) => handleChange('subscriptionRequired', e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Free Profile Views Limit</label>
                <input
                  type="number"
                  value={settings.freeProfileLimit}
                  onChange={(e) => handleChange('freeProfileLimit', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Number of profiles free users can view</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Premium Price (₹)</label>
                <input
                  type="number"
                  value={settings.premiumPrice}
                  onChange={(e) => handleChange('premiumPrice', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Monthly subscription price</p>
              </div>
            </div>
          </div>

          {/* Data & Privacy */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Database className="text-teal-600" size={24} />
              <h3 className="text-xl font-semibold text-gray-800">Data & Privacy</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention Period (Days)</label>
                <input
                  type="number"
                  value={settings.dataRetentionDays}
                  onChange={(e) => handleChange('dataRetentionDays', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Auto-delete inactive data after this period</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <FileText className="text-yellow-600 mt-0.5" size={18} />
                  <div>
                    <h4 className="text-sm font-semibold text-yellow-800 mb-1">Privacy Compliance</h4>
                    <p className="text-xs text-yellow-700">
                      Ensure settings comply with local data protection regulations and matrimonial laws.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <button className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              saved 
                ? 'bg-green-600 text-white' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Save size={20} />
            {saved ? 'Saved Successfully!' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;