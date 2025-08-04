import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useLogout from '../hooks/useLogout'
import useAuthContext from '../hooks/useAuthContext';

const Navbar = () => {
  const {user} = useAuthContext()
  const navigate = useNavigate();
  const {logout} = useLogout();
  const handleLogout = () => {
    logout()
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center mb-5">
      <div className="text-xl font-bold text-indigo-600">{user.username}'s Manager</div>

      <div className="flex gap-6 items-center text-gray-700">
        <Link to="/home" className="hover:text-indigo-600">Home</Link>
        <Link to="/projects" className="hover:text-indigo-600">Projects</Link>
        <Link to="/tasks" className="hover:text-indigo-600">Tasks</Link>
        <Link to="/notifications" className="hover:text-indigo-600">Notifications</Link>

        {/* Optional profile dropdown */}
        {/* <div className="relative group">
          <span className="cursor-pointer">Profile ▾</span>
          <div className="absolute hidden group-hover:block bg-white border rounded shadow-md mt-2 py-2 right-0 w-32">
            <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">My Profile</Link>
            <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
          </div>
        </div> */}

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
