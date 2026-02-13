const express = require('express');
const {
  createSubmission,
  getSubmission,
  getUserSubmissions,
  getProblemSubmissions
} = require('../controllers/submissionController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, createSubmission);
router.get('/', authenticateToken, getUserSubmissions);
router.get('/:id', authenticateToken, getSubmission);
router.get('/problem/:problemSlug', authenticateToken, getProblemSubmissions);

module.exports = router;
