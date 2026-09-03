import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle }) => (
  <div className="p-6 border-b border-gray-800">
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);
