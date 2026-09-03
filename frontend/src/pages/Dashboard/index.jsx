import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import MemberDashboard from '../Member/Dashboard';
import TrainerDashboard from '../Trainer/Dashboard';
import AdminDashboard from '../Admin/Dashboard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (user?.role === 'Admin') return <AdminDashboard />;
  if (user?.role === 'Trainer') return <TrainerDashboard />;
  return <MemberDashboard />;
};

export default Dashboard;
