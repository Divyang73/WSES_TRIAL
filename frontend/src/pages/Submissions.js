import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await api.get('/submissions');
      setSubmissions(response.data.submissions);
    } catch (err) {
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const getVerdictColor = (verdict) => {
    if (verdict === 'Accepted') return 'text-green-400';
    if (verdict === 'Pending') return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">My Submissions</h1>

        {loading && (
          <div className="text-center text-gray-400 py-12">
            Loading submissions...
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
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Problem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Verdict
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Runtime
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Memory
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-700 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(submission.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/problems/${submission.slug}`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {submission.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {submission.language}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getVerdictColor(submission.verdict)}`}>
                      {submission.verdict}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {submission.runtime ? `${submission.runtime}ms` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {submission.memory ? `${submission.memory}KB` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && submissions.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No submissions yet. Start solving problems!
          </div>
        )}
      </div>
    </div>
  );
};

export default Submissions;
