const db = require('../utils/database');

class TestCase {
  static async findByProblemId(problemId) {
    const [rows] = await db.query(
      'SELECT * FROM test_cases WHERE problem_id = ? ORDER BY id ASC',
      [problemId]
    );
    return rows;
  }

  static async findVisibleByProblemId(problemId) {
    const [rows] = await db.query(
      'SELECT id, input, expected_output FROM test_cases WHERE problem_id = ? AND is_hidden = FALSE ORDER BY id ASC',
      [problemId]
    );
    return rows;
  }
}

module.exports = TestCase;
