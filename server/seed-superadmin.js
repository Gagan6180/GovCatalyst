require('dotenv').config();
const pool = require('./src/config/db');
const { hashPassword } = require('./src/utils/authUtils');

(async () => {
  try {
    const email = 'superadmin@govcatalyst.com';
    const password = 'adminpassword123';
    
    // Check if user already exists
    const { rows: existing } = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.length > 0) {
      console.log('Superadmin already exists!');
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
    let values = ['Super Admin', email, hashed, 'super_admin', 'Headquarters', 'System Administrator', 'active'];

    try {
      const { rows } = await pool.query(query, values);
      console.log('Successfully created new superadmin!');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
    } catch (err) {
      // Fallback if account_status column doesn't exist or has different schema
      console.log('Fallback to standard insert without account_status...');
      query = `
        INSERT INTO users (name, email, password_hash, role, department_name, designation)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      values = ['Super Admin', email, hashed, 'super_admin', 'Headquarters', 'System Administrator'];
      const { rows } = await pool.query(query, values);
      
      // Update account status explicitly if schema allowed something else
      try {
        await pool.query("UPDATE users SET account_status = 'active' WHERE id = $1", [rows[0].id]);
      } catch (updateErr) {
        // Ignore if no such column exists
      }
      
      console.log('Successfully created superadmin!');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
    }

  } catch (err) {
    console.error('Insert failed:', err.message);
  } finally {
    pool.end();
  }
})();
