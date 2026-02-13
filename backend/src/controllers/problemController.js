const Problem = require('../models/Problem');
const TestCase = require('../models/TestCase');

const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.findAll();
    res.json({ problems });
  } catch (error) {
    console.error('Get all problems error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getProblemBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const problem = await Problem.findBySlug(slug);
    
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Get visible test cases
    const testCases = await TestCase.findVisibleByProblemId(problem.id);

    res.json({ problem, testCases });
  } catch (error) {
    console.error('Get problem error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllProblems, getProblemBySlug };
