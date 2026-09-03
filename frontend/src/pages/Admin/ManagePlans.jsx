import React, { useEffect, useState } from 'react';
import { planService } from '../../services/apiServices';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const ManagePlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Plan form
  const [name, setName] = useState('');
  const [durationMonths, setDuration] = useState(1);
  const [price, setPrice] = useState(0);
  const [features, setFeatures] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = () => {
    planService.getAll()
      .then(data => setPlans(data))
      .catch(err => toast.error('Failed to load plans'))
      .finally(() => setLoading(false));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const featuresArray = features.split(',').map(f => f.trim()).filter(f => f);
      await planService.create({ name, durationMonths: parseInt(durationMonths), price: parseFloat(price), features: featuresArray });
      toast.success('Plan created successfully!');
      fetchPlans();
      setName(''); setDuration(1); setPrice(0); setFeatures('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create plan');
    }
  };

  const handleDelete = async (id) => {
    try {
      await planService.delete(id);
      toast.success('Plan deleted');
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete plan');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Membership Plans</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader title="Create New Plan" />
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input label="Plan Name" required value={name} onChange={e => setName(e.target.value)} />
              <Input label="Features (comma separated)" value={features} onChange={e => setFeatures(e.target.value)} placeholder="Gym access, Dietician, etc." />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Duration (Months)" type="number" required min="1" value={durationMonths} onChange={e => setDuration(e.target.value)} />
                <Input label="Price ($)" type="number" step="0.01" required min="0" value={price} onChange={e => setPrice(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">Create Plan</Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {loading ? <p>Loading...</p> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plans.map(plan => (
                <Card key={plan._id} className="relative overflow-hidden">
                  <CardContent className="flex flex-col h-full pt-6">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <div className="mt-2 mb-6">
                      <span className="text-3xl font-extrabold">${plan.price}</span>
                      <span className="text-gray-400"> / {plan.durationMonths}mo</span>
                    </div>
                    <div className="mt-auto">
                      <Button variant="danger" onClick={() => handleDelete(plan._id)} className="w-full">Delete Plan</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ManagePlans;
