import React, { useState } from 'react';
import ManagePlans from './ManagePlans';
import Analytics from './Analytics';
import { Settings, BarChart2 } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('plans');

  const tabs = [
    { id: 'plans', label: 'Membership Plans', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                isActive ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        {activeTab === 'plans' && <ManagePlans />}
        {activeTab === 'analytics' && <Analytics />}
      </div>
    </div>
  );
};

export default AdminDashboard;
