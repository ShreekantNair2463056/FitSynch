import React, { useEffect, useState } from 'react';
import { planService, membershipService } from '../../services/apiServices';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    planService.getAll()
      .then(data => setPlans(data))
      .catch(err => toast.error('Failed to load plans'))
      .finally(() => setLoading(false));
  }, []);

  const handlePurchase = async (planId) => {
    try {
      await membershipService.purchase(planId);
      toast.success('Successfully subscribed to plan!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to purchase plan');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Membership Plans</h2>
      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <Card key={plan._id} className="relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>
              <CardContent className="flex flex-col h-full">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-4 mb-4">
                  <span className="text-4xl font-extrabold">₹{plan.price}</span>
                  <span className="text-gray-400"> / {plan.durationMonths}mo</span>
                </div>
                {plan.features && plan.features.length > 0 && (
                  <ul className="mb-8 space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto">
                  <Button onClick={() => handlePurchase(plan._id)} className="w-full">Select Plan</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
export default Plans;
