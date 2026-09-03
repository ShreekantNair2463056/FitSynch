import React, { useEffect, useState, useContext } from 'react';
import { classService } from '../../services/apiServices';
import { AuthContext } from '../../context/AuthContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const Schedule = () => {
  const { user } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Class Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [schedule, setScheduleDate] = useState('');
  const [durationMinutes, setDuration] = useState(60);
  const [capacity, setCapacity] = useState(20);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = () => {
    classService.getAll()
      .then(data => {
        // Filter classes for this trainer only
        const myClasses = data.filter(c => c.trainerId?._id === user.id || c.trainerId === user.id);
        setClasses(myClasses);
      })
      .catch(err => toast.error('Failed to load classes'))
      .finally(() => setLoading(false));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await classService.create({
        trainerId: user.id,
        title,
        description,
        schedule: new Date(schedule).toISOString(),
        durationMinutes: parseInt(durationMinutes),
        capacity: parseInt(capacity)
      });
      toast.success('Class scheduled successfully!');
      fetchClasses();
      setTitle('');
      setDescription('');
      setScheduleDate('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create class');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Schedule</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader title="Schedule New Class" />
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input label="Class Title" required value={title} onChange={e => setTitle(e.target.value)} />
              <Input label="Description" required value={description} onChange={e => setDescription(e.target.value)} />
              <Input label="Date & Time" type="datetime-local" required value={schedule} onChange={e => setScheduleDate(e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Duration (min)" type="number" required min="15" value={durationMinutes} onChange={e => setDuration(e.target.value)} />
                <Input label="Capacity" type="number" required min="1" value={capacity} onChange={e => setCapacity(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">Create Class</Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-lg text-gray-300">Upcoming Classes</h3>
          {loading ? <p>Loading...</p> : classes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classes.map(cls => (
                <Card key={cls._id}>
                  <CardHeader title={cls.title} subtitle={new Date(cls.schedule).toLocaleString()} />
                  <CardContent>
                    <p className="text-gray-400 text-sm mb-4">{cls.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Capacity: {cls.enrolledCount}/{cls.capacity}</span>
                      <span className="text-indigo-400 font-medium">{cls.durationMinutes} mins</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No classes scheduled yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default Schedule;
