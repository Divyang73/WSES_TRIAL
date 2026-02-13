const db = require('../utils/database');

class Submission {
  static async create(userId, problemId, language, code) {
    const [result] = await db.query(
      'INSERT INTO submissions (user_id, problem_id, language, code, verdict) VALUES (?, ?, ?, ?, ?)',
      [userId, problemId, language, code, 'Pending']
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM submissions WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async updateJudgeToken(id, token) {
    await db.query(
      'UPDATE submissions SET judge_token = ? WHERE id = ?',
      [token, id]
    );
  }

  static async updateVerdict(id, verdict, runtime = null, memory = null, errorMessage = null) {
    await db.query(
      'UPDATE submissions SET verdict = ?, runtime = ?, memory = ?, error_message = ? WHERE id = ?',
      [verdict, runtime, memory, errorMessage, id]
    );
  }

  static async findByUserId(userId, limit = 50) {
    const [rows] = await db.query(
      `SELECT s.id, s.problem_id, s.language, s.verdict, s.runtime, s.memory, 
              s.created_at, p.title, p.slug 
       FROM submissions s 
       JOIN problems p ON s.problem_id = p.id 
       WHERE s.user_id = ? 
       ORDER BY s.created_at DESC 
       LIMIT ?`,
      [userId, limit]
    );
    return rows;
  }

  static async findByUserIdAndProblemId(userId, problemId, limit = 20) {
    const [rows] = await db.query(
      `SELECT id, language, verdict, runtime, memory, created_at 
       FROM submissions 
       WHERE user_id = ? AND problem_id = ? 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [userId, problemId, limit]
    );
    return rows;
  }
}

module.exports = Submission;
