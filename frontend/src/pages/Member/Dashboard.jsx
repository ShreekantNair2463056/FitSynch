import React, { useState } from 'react';
import Overview from './Overview';
import Plans from './Plans';
import Classes from './Classes';
import Workouts from './Workouts';
import Attendance from './Attendance';
import { Calendar, User, Activity, Dumbbell, Clock } from 'lucide-react';

const MemberDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'plans', label: 'Memberships', icon: Activity },
    { id: 'classes', label: 'Class Schedule', icon: Calendar },
    { id: 'workouts', label: 'My Workouts', icon: Dumbbell },
    { id: 'attendance', label: 'Attendance', icon: Clock },
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
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'plans' && <Plans />}
        {activeTab === 'classes' && <Classes />}
        {activeTab === 'workouts' && <Workouts />}
        {activeTab === 'attendance' && <Attendance />}
      </div>
    </div>
  );
};

export default MemberDashboard;
