import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await api.get('/problems');
      setProblems(response.data.problems);
    } catch (err) {
      setError('Failed to load problems');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Problems</h1>

        {loading && (
          <div className="text-center text-gray-400 py-12">
            Loading problems...
          </div>
        )}

        {error && (
          <div className="bg-red-500 text-white p-4 rounded mb-6">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Difficulty
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {problems.map((problem) => (
                  <tr key={problem.id} className="hover:bg-gray-700 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {problem.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/problems/${problem.slug}`}
                        className="text-blue-400 hover:text-blue-300 font-medium"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && problems.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No problems available yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemList;
