const express = require('express');
const { getAllProblems, getProblemBySlug } = require('../controllers/problemController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, getAllProblems);
router.get('/:slug', authenticateToken, getProblemBySlug);

module.exports = router;
