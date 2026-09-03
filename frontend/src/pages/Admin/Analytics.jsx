import React, { useEffect, useState } from 'react';
import { reportService } from '../../services/apiServices';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Analytics = () => {
  const [attendance, setAttendance] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      reportService.getAttendance().catch(() => []),
      reportService.getPlans().catch(() => [])
    ]).then(([attData, planData]) => {
      // Backend returns dates in attendance, map them for Recharts
      const formattedAtt = (Array.isArray(attData) ? attData : []).map(d => ({
        date: d._id || 'Unknown',
        checkIns: d.count || 0
      }));
      setAttendance(formattedAtt);
      
      const formattedPlans = (Array.isArray(planData) ? planData : []).map(d => ({
        name: d.planDetails?.name || 'Unknown Plan',
        value: d.count || 0
      }));
      setPlans(formattedPlans);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Business Analytics</h2>
      
      {loading ? <p>Loading data...</p> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Attendance Trends" subtitle="Daily check-in volume" />
            <CardContent className="h-80">
              {attendance.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendance}>
                    <XAxis dataKey="date" stroke="#9ca3af" tick={{fontSize: 12}} />
                    <YAxis stroke="#9ca3af" tick={{fontSize: 12}} />
                    <Tooltip cursor={{fill: '#1f2937'}} contentStyle={{backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px'}} />
                    <Bar dataKey="checkIns" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400 text-center mt-20">No attendance data available.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Plan Popularity" subtitle="Distribution of active subscriptions" />
            <CardContent className="h-80 flex items-center justify-center">
              {plans.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={plans}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {plans.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px'}} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400">No plan data available.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
export default Analytics;
