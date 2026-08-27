const pool = require('../config/db');

const User = {
  async create({ name, email, password_hash, role, department_name, designation }) {
    const query = `
      INSERT INTO users (name, email, password_hash, role, department_name, designation)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, email, role, department_name, designation, created_at
    `;
    const values = [name, email, password_hash, role, department_name || null, designation || null];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT id, name, email, role, department_name, designation, created_at 
       FROM users WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async findPendingUsers() {
  const { rows } = await pool.query(
    `SELECT id, name, email, role, department_name, designation, created_at 
     FROM users WHERE account_status = 'pending' ORDER BY created_at ASC`
  );
  return rows;
},

async updateStatus(userId, status, approvedBy = null) {
  const { rows } = await pool.query(
    `UPDATE users SET account_status = $1, approved_by = $2, approved_at = now()
     WHERE id = $3 RETURNING *`,
    [status, approvedBy, userId]
  );
  return rows[0];
},
};


module.exports = User;