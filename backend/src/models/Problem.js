const db = require('../utils/database');

class Problem {
  static async findAll() {
    const [rows] = await db.query(
      'SELECT id, title, slug, difficulty, created_at FROM problems ORDER BY id ASC'
    );
    return rows;
  }

  static async findBySlug(slug) {
    const [rows] = await db.query(
      'SELECT * FROM problems WHERE slug = ?',
      [slug]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM problems WHERE id = ?',
      [id]
    );
    return rows[0];
  }
}

module.exports = Problem;
