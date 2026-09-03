import React, { useEffect, useState } from 'react';
import { workoutService, authService } from '../../services/apiServices';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const Trainees = () => {
  const [plans, setPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedMember, setSelectedMember] = useState(null); // Can be an existing plan OR a member object
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [dietNotes, setDietNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      workoutService.getAssignedPlans().catch(() => []),
      authService.getMembers().catch(() => [])
    ]).then(([plansData, membersData]) => {
      setPlans(Array.isArray(plansData) ? plansData : []);
      setMembers(Array.isArray(membersData) ? membersData : []);
    }).finally(() => setLoading(false));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // selectedMember might be a Plan object (has .memberId._id) or a Member object (has ._id)
      const targetMemberId = selectedMember.memberId ? selectedMember.memberId._id : selectedMember._id;
      
      await workoutService.assignPlan(targetMemberId, {
        title: `Plan for ${selectedMember.memberId ? selectedMember.memberId.name : selectedMember.name}`,
        workoutNotes,
        dietNotes
      });
      toast.success('Notes updated successfully!');
      setIsEditing(false);
      setSelectedMember(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update notes');
    }
  };

  const openEditorForPlan = (plan) => {
    setSelectedMember(plan);
    setWorkoutNotes(plan.workoutNotes || '');
    setDietNotes(plan.dietNotes || '');
    setIsEditing(true);
  };

  const openEditorForNewMember = (e) => {
    const memberId = e.target.value;
    if (!memberId) return;
    
    // Check if this member already has a plan assigned by this trainer
    const existingPlan = plans.find(p => p.memberId._id === memberId);
    if (existingPlan) {
      openEditorForPlan(existingPlan);
    } else {
      const member = members.find(m => m._id === memberId);
      if (member) {
        setSelectedMember(member);
        setWorkoutNotes('');
        setDietNotes('');
        setIsEditing(true);
      }
    }
    // Reset dropdown
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Trainee Progress Logs</h2>
        
        {!isEditing && (
          <select 
            onChange={openEditorForNewMember}
            className="bg-indigo-600 hover:bg-indigo-700 text-white border-none text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none transition-colors"
          >
            <option value="">+ Assign Plan to Member</option>
            {members.map(m => (
              <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
            ))}
          </select>
        )}
      </div>
      
      {isEditing && selectedMember ? (
        <Card className="w-full max-w-2xl">
          <CardHeader 
            title={`Edit Notes for ${selectedMember.memberId ? selectedMember.memberId.name : selectedMember.name}`} 
            subtitle={selectedMember.memberId ? selectedMember.memberId.email : selectedMember.email} 
          />
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">Workout Notes</label>
                <textarea 
                  className="bg-gray-900 border border-gray-800 focus:border-indigo-500 rounded-lg p-3 text-gray-100 outline-none h-32"
                  value={workoutNotes}
                  onChange={e => setWorkoutNotes(e.target.value)}
                  placeholder="Enter workout instructions..."
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">Diet Notes</label>
                <textarea 
                  className="bg-gray-900 border border-gray-800 focus:border-indigo-500 rounded-lg p-3 text-gray-100 outline-none h-32"
                  value={dietNotes}
                  onChange={e => setDietNotes(e.target.value)}
                  placeholder="Enter dietary guidelines..."
                />
              </div>
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">Save Changes</Button>
                <Button variant="secondary" onClick={() => setIsEditing(false)} type="button">Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? <p>Loading...</p> : plans.map(plan => (
            <Card key={plan._id}>
              <CardHeader title={plan.memberId.name} subtitle={plan.title} />
              <CardContent>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  <span className="font-semibold text-gray-300">Workout:</span> {plan.workoutNotes || 'None'}
                </p>
                <Button variant="secondary" onClick={() => openEditorForPlan(plan)} className="w-full">Edit Notes</Button>
              </CardContent>
            </Card>
          ))}
          {!loading && plans.length === 0 && (
            <p className="text-gray-400">No trainees found. Use the dropdown above to assign a plan to a member!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Trainees;
