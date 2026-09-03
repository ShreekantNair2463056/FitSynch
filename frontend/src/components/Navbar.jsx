import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from './ui/Button';
import { Dumbbell, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-500 transition-colors">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">FitSynch</span>
          </Link>
          
          {user ? (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <User className="w-4 h-4" />
                <span>{user.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-gray-800 text-xs font-medium border border-gray-700">
                  {user.role}
                </span>
              </div>
              <Button variant="secondary" onClick={handleLogout} className="!px-3 !py-1.5 gap-2 text-sm">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Log in
              </Link>
              <Link to="/register">
                <Button className="!px-4 !py-1.5 text-sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
