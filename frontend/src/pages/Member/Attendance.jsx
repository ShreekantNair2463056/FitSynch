import React, { useEffect, useState } from 'react';
import { attendanceService } from '../../services/apiServices';
import { Card, CardContent } from '../../components/ui/Card';

const Attendance = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    attendanceService.getMyAttendance()
      .then(data => setLogs(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Attendance History</h2>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-900 border-b border-gray-800 text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Date & Time</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Class (if applicable)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr><td colSpan="3" className="px-6 py-4 text-center">Loading...</td></tr>
                ) : logs.length > 0 ? (
                  logs.map(log => (
                    <tr key={log._id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">{new Date(log.checkInTime).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${log.type === 'ClassCheckIn' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                          {log.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{log.classId?.title || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-500">No attendance records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default Attendance;
