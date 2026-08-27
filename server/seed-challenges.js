require('dotenv').config();
const pool = require('./src/config/db');

(async () => {
  try {
    const { rows: deptUsers } = await pool.query("SELECT id FROM users WHERE role = 'dept_admin' LIMIT 1");
    const deptAdminId = deptUsers.length > 0 ? deptUsers[0].id : null;

    if (deptAdminId) {
      await pool.query(`
        INSERT INTO challenges (
          dept_admin_id, title, raw_problem_input, outcome_statement,
          sector, tech_tags, budget_ceiling, pilot_duration_days,
          risk_level, status
        ) VALUES
        (
          $1,
          'AI Highway & Bridge Structural Health Inspection',
          'Manual bridge and highway structural inspection in difficult terrains is slow, dangerous, and causes traffic bottlenecks.',
          'Deploy an automated drone and computer-vision solution achieving >= 90% defect detection accuracy and reducing inspection turnaround time by >= 40% over an 8-week pilot across NH-48 corridor.',
          'Infrastructure',
          ARRAY['AI/ML', 'Computer Vision', 'Drone Inspection', 'IoT', 'Infrastructure'],
          2500000,
          60,
          'medium',
          'published'
        )
        ON CONFLICT DO NOTHING;
      `, [deptAdminId]);
    }

    const { rows: published } = await pool.query("SELECT id, title, sector, status FROM challenges WHERE status = 'published'");
    console.log('\n========================================');
    console.log('🏛️  PUBLISHED CHALLENGES:');
    console.log('========================================');
    console.table(published);
    console.log('========================================\n');

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    pool.end();
  }
})();
