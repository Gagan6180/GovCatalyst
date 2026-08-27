const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Handle idle client errors so a dropped connection doesn't crash your server mid-demo
pool.on("error", (err) => {
    console.error("Unexpected PG pool error:", err.message);
});

const testDbConnection = async () => {
    try {
        const client = await pool.connect();
        console.log("Database connected successfully!");
        client.release();
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1); // fail fast if DB isn't reachable — better than silent failures later
    }
};

testDbConnection();

module.exports = pool;
