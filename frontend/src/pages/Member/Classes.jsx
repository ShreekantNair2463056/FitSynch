import React, { useEffect, useState } from 'react';
import { classService } from '../../services/apiServices';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = () => {
    classService.getAll()
      .then(data => setClasses(data))
      .catch(err => toast.error('Failed to load classes'))
      .finally(() => setLoading(false));
  };

  const handleBook = async (id) => {
    try {
      await classService.book(id);
      toast.success('Successfully booked class!');
      fetchClasses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book class');
    }
  };

  const handleWaitlist = async (id) => {
    try {
      await classService.waitlist(id);
      toast.success('Joined waitlist!');
      fetchClasses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join waitlist');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Class Schedule</h2>
      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map(cls => (
            <Card key={cls._id}>
              <CardHeader title={cls.title} subtitle={new Date(cls.schedule).toLocaleString()} />
              <CardContent>
                <p className="text-gray-400 mb-4">{cls.description}</p>
                <div className="flex justify-between items-center mb-6 text-sm">
                  <span className="text-gray-300">Duration: {cls.durationMinutes} min</span>
                  <span className="text-gray-300">Spots: {cls.capacity - cls.enrolledCount}/{cls.capacity}</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1" 
                    onClick={() => handleBook(cls._id)}
                    disabled={cls.enrolledCount >= cls.capacity}
                  >
                    Book Now
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="flex-1"
                    onClick={() => handleWaitlist(cls._id)}
                    disabled={cls.enrolledCount < cls.capacity}
                  >
                    Waitlist
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
export default Classes;
