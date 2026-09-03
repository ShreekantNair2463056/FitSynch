import React, { useEffect, useState } from 'react';
import { membershipService } from '../../services/apiServices';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Activity } from 'lucide-react';

const Overview = () => {
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    membershipService.getMyMembership()
      .then(data => setMembership(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome Back!</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader title="Active Membership" subtitle="Your current plan details" />
          <CardContent>
            {loading ? <p className="text-gray-400">Loading...</p> : membership ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Plan</span>
                  <span className="font-semibold text-indigo-400">{membership.plan?.name || 'Unknown Plan'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${membership.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {membership.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Expires</span>
                  <span className="text-gray-200">{new Date(membership.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <Activity className="w-8 h-8 text-gray-600 mx-auto" />
                <p className="text-gray-400">No active membership found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Overview;
