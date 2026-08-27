const pool = require('../config/db');

const DpiitMockRegistry = {
  async findByRegNumber(regNumber) {
    const { rows } = await pool.query(
      'SELECT * FROM dpiit_mock_registry WHERE dpiit_reg_number = $1 AND is_active = true',
      [regNumber]
    );
    return rows[0] || null;
  },
};

module.exports = DpiitMockRegistry;