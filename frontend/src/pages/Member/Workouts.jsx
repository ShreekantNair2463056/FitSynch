import React, { useEffect, useState } from 'react';
import { workoutService } from '../../services/apiServices';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';

const Workouts = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    workoutService.getMyPlans()
      .then(data => setPlans(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Workout & Diet Notes</h2>
      {loading ? <p>Loading...</p> : plans.length > 0 ? (
        <div className="space-y-6">
          {plans.map(plan => (
            <Card key={plan._id}>
              <CardHeader title={plan.title} subtitle={`Assigned by Trainer`} />
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-indigo-400 mb-2">Workout Plan</h4>
                  <div className="bg-gray-950 p-4 rounded-lg text-gray-300 whitespace-pre-wrap border border-gray-800">
                    {plan.workoutNotes || 'No workout notes provided.'}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-indigo-400 mb-2">Diet Plan</h4>
                  <div className="bg-gray-950 p-4 rounded-lg text-gray-300 whitespace-pre-wrap border border-gray-800">
                    {plan.dietNotes || 'No diet notes provided.'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">You don't have any workout plans assigned yet.</p>
      )}
    </div>
  );
};
export default Workouts;
