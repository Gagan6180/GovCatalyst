require('dotenv').config();
const pool = require('./src/config/db');
const { hashPassword } = require('./src/utils/authUtils');

(async () => {
  try {
    const email = 'startup@example.com';
    const password = 'startuppassword123';
    const companyName = 'InspectAI Technologies';

    // 1. Check or insert user
    let user;
    const { rows: existingUsers } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existingUsers.length > 0) {
      user = existingUsers[0];
      console.log('ℹ️  User already exists with email:', email);
      try {
        await pool.query("UPDATE users SET account_status = 'active' WHERE id = $1", [user.id]);
      } catch (e) {}
    } else {
      const hashed = await hashPassword(password);
      try {
        const { rows } = await pool.query(
          `INSERT INTO users (name, email, password_hash, role, designation, account_status)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *;`,
          [companyName, email, hashed, 'startup', 'Founder & CEO', 'active']
        );
        user = rows[0];
      } catch (err) {
        const { rows } = await pool.query(
          `INSERT INTO users (name, email, password_hash, role, designation)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *;`,
          [companyName, email, hashed, 'startup', 'Founder & CEO']
        );
        user = rows[0];
      }
      console.log('✅ Created new startup user:');
    }

    // 2. Check or insert/update startup profile
    const { rows: existingStartups } = await pool.query('SELECT * FROM startups WHERE user_id = $1', [user.id]);

    let startup;
    if (existingStartups.length > 0) {
      const { rows } = await pool.query(
        `UPDATE startups SET
          company_name = $1,
          sector = $2,
          stage = $3,
          founded_year = $4,
          team_size = $5,
          past_turnover = $6,
          tech_tags = $7,
          pitch_summary = $8,
          website_url = $9,
          dpiit_reg_number = $10,
          verification_status = $11,
          verification_method = $12,
          verified_at = now(),
          updated_at = now()
         WHERE user_id = $13
         RETURNING *;`,
        [
          companyName,
          'Infrastructure',
          'Growth',
          2022,
          15,
          4500000,
          ['AI/ML', 'Computer Vision', 'Drone Inspection', 'IoT', 'Infrastructure'],
          'Automated drone and computer-vision powered highway and bridge structural health inspection with 92% defect detection accuracy.',
          'https://inspectai.example.com',
          'DIPP98765',
          'verified_dpiit',
          'dpiit_redirect',
          user.id
        ]
      );
      startup = rows[0];
      console.log('✅ Updated startup profile with full demo details.');
    } else {
      const { rows } = await pool.query(
        `INSERT INTO startups (
          user_id, company_name, sector, stage, founded_year, team_size,
          past_turnover, tech_tags, pitch_summary, website_url,
          dpiit_reg_number, verification_status, verification_method, verified_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, now())
        RETURNING *;`,
        [
          user.id,
          companyName,
          'Infrastructure',
          'Growth',
          2022,
          15,
          4500000,
          ['AI/ML', 'Computer Vision', 'Drone Inspection', 'IoT', 'Infrastructure'],
          'Automated drone and computer-vision powered highway and bridge structural health inspection with 92% defect detection accuracy.',
          'https://inspectai.example.com',
          'DIPP98765',
          'verified_dpiit',
          'dpiit_redirect'
        ]
      );
      startup = rows[0];
      console.log('✅ Created startup profile with full demo details.');
    }

    console.log('\n========================================');
    console.log('🚀 DEMO STARTUP CREDENTIALS & PROFILE:');
    console.log('========================================');
    console.log(`Email:               ${email}`);
    console.log(`Password:            ${password}`);
    console.log(`Role:                startup`);
    console.log(`Company Name:        ${startup.company_name}`);
    console.log(`Sector:              ${startup.sector}`);
    console.log(`Stage:               ${startup.stage}`);
    console.log(`DPIIT Status:        ${startup.verification_status} (${startup.dpiit_reg_number})`);
    console.log(`Tech Tags:           ${startup.tech_tags.join(', ')}`);
    console.log('========================================\n');

  } catch (err) {
    console.error('❌ Insert/update failed:', err.message);
  } finally {
    pool.end();
  }
})();
