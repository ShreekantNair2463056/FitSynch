import React, { useState } from 'react';
import Schedule from './Schedule';
import Trainees from './Trainees';
import { Calendar, Users } from 'lucide-react';

const TrainerDashboard = () => {
  const [activeTab, setActiveTab] = useState('schedule');

  const tabs = [
    { id: 'schedule', label: 'My Schedule', icon: Calendar },
    { id: 'trainees', label: 'My Trainees', icon: Users },
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
        {activeTab === 'schedule' && <Schedule />}
        {activeTab === 'trainees' && <Trainees />}
      </div>
    </div>
  );
};

export default TrainerDashboard;
