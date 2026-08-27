require('dotenv').config();
const pool = require('./src/config/db');
const { hashPassword } = require('./src/utils/authUtils');

(async () => {
  try {
    const email = 'dept_admin@example.com';
    const password = 'adminpassword';
    
    // Check if user already exists
    const { rows: existing } = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.length > 0) {
      console.log('✅ Dept Admin already exists! Updating status to active...');
      try {
        await pool.query("UPDATE users SET account_status = 'active' WHERE email = $1", [email]);
      } catch (e) {}
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      process.exit(0);
    }

    const hashed = await hashPassword(password);
    
    // Attempt insert with account_status active
    let query = `
      INSERT INTO users (name, email, password_hash, role, department_name, designation, account_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    let values = ['Dept Admin Tester', email, hashed, 'dept_admin', 'AI Testing Dept', 'Admin', 'active'];

    try {
      const { rows } = await pool.query(query, values);
      console.log('✅ Successfully created new active dept_admin!');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
    } catch (err) {
      console.log('Fallback to standard insert without account_status...');
      query = `
        INSERT INTO users (name, email, password_hash, role, department_name, designation)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      values = ['Dept Admin Tester', email, hashed, 'dept_admin', 'AI Testing Dept', 'Admin'];
      const { rows } = await pool.query(query, values);
      
      try {
        await pool.query("UPDATE users SET account_status = 'active' WHERE id = $1", [rows[0].id]);
      } catch (updateErr) {}
      
      console.log('✅ Successfully created dept_admin!');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
    }

  } catch (err) {
    console.error('❌ Insert failed:', err.message);
  } finally {
    pool.end();
  }
})();
