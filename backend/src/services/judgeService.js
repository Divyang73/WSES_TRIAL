const axios = require('axios');

const JUDGE0_URL = process.env.JUDGE0_URL || 'http://judge0:2358';

// Language ID mapping for Judge0
const LANGUAGE_MAP = {
  'javascript': 63,  // Node.js
  'python': 71,      // Python 3
  'java': 62,        // Java
  'cpp': 54,         // C++
  'c': 50,           // C
};

const submitToJudge0 = async (code, languageId, input, expectedOutput) => {
  try {
    const response = await axios.post(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`, {
      source_code: code,
      language_id: languageId,
      stdin: input,
      expected_output: expectedOutput
    });

    return response.data.token;
  } catch (error) {
    console.error('Judge0 submission error:', error.message);
    throw new Error('Failed to submit to Judge0');
  }
};

const getSubmissionResult = async (token) => {
  try {
    const response = await axios.get(`${JUDGE0_URL}/submissions/${token}?base64_encoded=false`);
    return response.data;
  } catch (error) {
    console.error('Judge0 get result error:', error.message);
    throw new Error('Failed to get result from Judge0');
  }
};

const pollSubmission = async (token, maxAttempts = 30, interval = 1000) => {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await getSubmissionResult(token);
    
    // Status ID meanings:
    // 1: In Queue, 2: Processing, 3: Accepted, 4: Wrong Answer, 5: Time Limit Exceeded
    // 6: Compilation Error, 7-14: Various runtime errors
    if (result.status.id > 2) {
      return result;
    }

    await new Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error('Polling timeout');
};

const mapVerdict = (statusId, statusDescription) => {
  const verdictMap = {
    3: 'Accepted',
    4: 'Wrong Answer',
    5: 'Time Limit Exceeded',
    6: 'Compilation Error',
    7: 'Runtime Error (SIGSEGV)',
    8: 'Runtime Error (SIGXFSZ)',
    9: 'Runtime Error (SIGFPE)',
    10: 'Runtime Error (SIGABRT)',
    11: 'Runtime Error (NZEC)',
    12: 'Runtime Error (Other)',
    13: 'Internal Error',
    14: 'Exec Format Error'
  };

  return verdictMap[statusId] || statusDescription || 'Unknown Error';
};

module.exports = {
  LANGUAGE_MAP,
  submitToJudge0,
  getSubmissionResult,
  pollSubmission,
  mapVerdict
};
