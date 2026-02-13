const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const TestCase = require('../models/TestCase');
const { LANGUAGE_MAP, submitToJudge0, pollSubmission, mapVerdict } = require('../services/judgeService');

const createSubmission = async (req, res) => {
  try {
    const { problemSlug, code, language } = req.body;
    const userId = req.user.id;

    if (!problemSlug || !code || !language) {
      return res.status(400).json({ error: 'Problem, code, and language are required' });
    }

    // Validate language
    const languageId = LANGUAGE_MAP[language.toLowerCase()];
    if (!languageId) {
      return res.status(400).json({ error: 'Unsupported language' });
    }

    // Find problem
    const problem = await Problem.findBySlug(problemSlug);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Create submission record
    const submissionId = await Submission.create(userId, problem.id, language, code);

    // Start async processing
    processSubmission(submissionId, problem.id, code, languageId);

    res.status(201).json({
      message: 'Submission created',
      submissionId
    });
  } catch (error) {
    console.error('Create submission error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const processSubmission = async (submissionId, problemId, code, languageId) => {
  try {
    // Get all test cases
    const testCases = await TestCase.findByProblemId(problemId);
    
    if (testCases.length === 0) {
      await Submission.updateVerdict(submissionId, 'No Test Cases');
      return;
    }

    let allPassed = true;
    let totalRuntime = 0;
    let totalMemory = 0;
    let finalVerdict = 'Accepted';
    let errorMessage = null;

    // Run against all test cases
    for (const testCase of testCases) {
      try {
        // Submit to Judge0
        const token = await submitToJudge0(
          code,
          languageId,
          testCase.input,
          testCase.expected_output
        );

        // Store token for first test case
        if (testCases.indexOf(testCase) === 0) {
          await Submission.updateJudgeToken(submissionId, token);
        }

        // Poll for result
        const result = await pollSubmission(token);

        // Accumulate metrics
        if (result.time) totalRuntime += parseFloat(result.time) * 1000; // Convert to ms
        if (result.memory) totalMemory += parseInt(result.memory);

        // Check verdict
        if (result.status.id !== 3) { // Not accepted
          allPassed = false;
          finalVerdict = mapVerdict(result.status.id, result.status.description);
          
          if (result.compile_output) {
            errorMessage = result.compile_output;
          } else if (result.stderr) {
            errorMessage = result.stderr;
          } else if (result.message) {
            errorMessage = result.message;
          }
          
          break; // Stop on first failure
        }
      } catch (error) {
        console.error('Test case execution error:', error);
        allPassed = false;
        finalVerdict = 'Runtime Error';
        errorMessage = error.message;
        break;
      }
    }

    // Update submission with final verdict
    const avgRuntime = testCases.length > 0 ? Math.round(totalRuntime / testCases.length) : null;
    const avgMemory = testCases.length > 0 ? Math.round(totalMemory / testCases.length) : null;

    await Submission.updateVerdict(
      submissionId,
      finalVerdict,
      avgRuntime,
      avgMemory,
      errorMessage
    );

  } catch (error) {
    console.error('Process submission error:', error);
    await Submission.updateVerdict(submissionId, 'System Error', null, null, error.message);
  }
};

const getSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findById(id);

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Check authorization
    if (submission.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({ submission });
  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;

    const submissions = await Submission.findByUserId(userId, limit);
    res.json({ submissions });
  } catch (error) {
    console.error('Get user submissions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getProblemSubmissions = async (req, res) => {
  try {
    const { problemSlug } = req.params;
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;

    // Find problem
    const problem = await Problem.findBySlug(problemSlug);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const submissions = await Submission.findByUserIdAndProblemId(userId, problem.id, limit);
    res.json({ submissions });
  } catch (error) {
    console.error('Get problem submissions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createSubmission,
  getSubmission,
  getUserSubmissions,
  getProblemSubmissions
};
