import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const ProblemDetail = () => {
  const { slug } = useParams();
  const [problem, setProblem] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitResult, setSubmitResult] = useState(null);

  const languageTemplates = {
    python: '# Write your code here\n\n',
    javascript: '// Write your code here\n\n',
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}\n',
    c: '#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}\n',
    java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}\n'
  };

  useEffect(() => {
    fetchProblem();
    fetchSubmissions();
  }, [slug]);

  useEffect(() => {
    setCode(languageTemplates[language]);
  }, [language]);

  const fetchProblem = async () => {
    try {
      const response = await api.get(`/problems/${slug}`);
      setProblem(response.data.problem);
      setTestCases(response.data.testCases);
      setCode(languageTemplates[language]);
    } catch (err) {
      setError('Failed to load problem');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await api.get(`/submissions/problem/${slug}`);
      setSubmissions(response.data.submissions);
    } catch (err) {
      console.error('Failed to load submissions:', err);
    }
  };

  const pollSubmissionStatus = useCallback(async (submissionId) => {
    const maxAttempts = 60;
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await api.get(`/submissions/${submissionId}`);
        const submission = response.data.submission;

        if (submission.verdict !== 'Pending' || attempts >= maxAttempts) {
          setSubmitResult(submission);
          setSubmitting(false);
          fetchSubmissions();
          return;
        }

        attempts++;
        setTimeout(poll, 1000);
      } catch (err) {
        console.error('Polling error:', err);
        setSubmitting(false);
        setError('Failed to get submission status');
      }
    };

    poll();
  }, []);

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Code cannot be empty');
      return;
    }

    setSubmitting(true);
    setError('');
    setSubmitResult(null);

    try {
      const response = await api.post('/submissions', {
        problemSlug: slug,
        code,
        language
      });

      const submissionId = response.data.submissionId;
      pollSubmissionStatus(submissionId);
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed');
      setSubmitting(false);
    }
  };

  const getVerdictColor = (verdict) => {
    if (verdict === 'Accepted') return 'text-green-400';
    if (verdict === 'Pending') return 'text-yellow-400';
    return 'text-red-400';
  };

  const getVerdictBgColor = (verdict) => {
    if (verdict === 'Accepted') return 'bg-green-600';
    if (verdict === 'Pending') return 'bg-yellow-600';
    return 'bg-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <div className="text-white text-xl">Loading problem...</div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <div className="text-white text-xl">Problem not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Problem Description */}
        <div className="w-1/2 overflow-y-auto bg-gray-800 p-6">
          <h1 className="text-3xl font-bold text-white mb-4">{problem.title}</h1>
          
          <div className={`inline-block px-3 py-1 rounded text-sm font-semibold mb-6 ${
            problem.difficulty === 'Easy' ? 'bg-green-600' :
            problem.difficulty === 'Medium' ? 'bg-yellow-600' :
            'bg-red-600'
          } text-white`}>
            {problem.difficulty}
          </div>

          <div className="text-gray-300 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Description</h2>
              <p className="whitespace-pre-wrap">{problem.description}</p>
            </div>

            {problem.input_format && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Input Format</h2>
                <p className="whitespace-pre-wrap">{problem.input_format}</p>
              </div>
            )}

            {problem.output_format && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Output Format</h2>
                <p className="whitespace-pre-wrap">{problem.output_format}</p>
              </div>
            )}

            {problem.constraints && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Constraints</h2>
                <p className="whitespace-pre-wrap">{problem.constraints}</p>
              </div>
            )}

            {testCases.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Sample Test Cases</h2>
                {testCases.map((testCase, index) => (
                  <div key={testCase.id} className="mb-4 bg-gray-700 p-4 rounded">
                    <div className="font-semibold text-white mb-2">Test Case {index + 1}</div>
                    <div className="mb-2">
                      <div className="text-sm text-gray-400 mb-1">Input:</div>
                      <pre className="bg-gray-900 p-2 rounded text-sm">{testCase.input}</pre>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Expected Output:</div>
                      <pre className="bg-gray-900 p-2 rounded text-sm">{testCase.expected_output}</pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Code Editor */}
        <div className="w-1/2 flex flex-col bg-gray-900">
          <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="java">Java</option>
            </select>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>

          <div className="flex-1">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Submission Result */}
          {submitResult && (
            <div className="bg-gray-800 p-4 border-t border-gray-700">
              <div className="flex items-center space-x-4">
                <span className={`px-4 py-2 rounded font-semibold ${getVerdictBgColor(submitResult.verdict)} text-white`}>
                  {submitResult.verdict}
                </span>
                {submitResult.runtime && (
                  <span className="text-gray-300">Runtime: {submitResult.runtime}ms</span>
                )}
                {submitResult.memory && (
                  <span className="text-gray-300">Memory: {submitResult.memory}KB</span>
                )}
              </div>
              {submitResult.error_message && (
                <pre className="mt-3 bg-gray-900 p-3 rounded text-red-400 text-sm overflow-x-auto">
                  {submitResult.error_message}
                </pre>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-500 text-white p-4">
              {error}
            </div>
          )}

          {/* Submission History */}
          <div className="bg-gray-800 p-4 border-t border-gray-700 max-h-64 overflow-y-auto">
            <h3 className="text-white font-semibold mb-3">Recent Submissions</h3>
            {submissions.length === 0 ? (
              <div className="text-gray-400 text-sm">No submissions yet</div>
            ) : (
              <div className="space-y-2">
                {submissions.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between bg-gray-700 p-2 rounded text-sm">
                    <span className="text-gray-400">
                      {new Date(sub.created_at).toLocaleString()}
                    </span>
                    <span className="text-gray-400">{sub.language}</span>
                    <span className={`font-semibold ${getVerdictColor(sub.verdict)}`}>
                      {sub.verdict}
                    </span>
                    {sub.runtime && (
                      <span className="text-gray-400">{sub.runtime}ms</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;
