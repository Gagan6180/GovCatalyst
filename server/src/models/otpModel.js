const pool = require('../config/db');

const Otp = {
  async create(userId, otpCode, expiresInMinutes = 10) {
    const expires_at = new Date(Date.now() + expiresInMinutes * 60000);
    const { rows } = await pool.query(
      `INSERT INTO otp_verifications (user_id, otp_code, expires_at) 
       VALUES ($1, $2, $3) RETURNING *`,
      [userId, otpCode, expires_at]
    );
    return rows[0];
  },

  async verify(userId, otpCode) {
    const { rows } = await pool.query(
      `SELECT * FROM otp_verifications 
       WHERE user_id = $1 AND otp_code = $2 AND is_used = false AND expires_at > now()`,
      [userId, otpCode]
    );
    if (rows.length === 0) return false;
    await pool.query(`UPDATE otp_verifications SET is_used = true WHERE id = $1`, [rows[0].id]);
    return true;
  },
};

module.exports = Otp;