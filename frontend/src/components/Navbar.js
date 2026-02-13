import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-400">
            WSES
          </Link>
          
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <Link to="/" className="hover:text-blue-400 transition">
                  Problems
                </Link>
                <Link to="/submissions" className="hover:text-blue-400 transition">
                  Submissions
                </Link>
                <span className="text-gray-400">{user.name}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
