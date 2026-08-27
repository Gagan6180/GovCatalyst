require("dotenv").config();
const express = require("express");
require("./config/db");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Basic Route
app.get("/", (req, res) => {
    res.send("Server is running!");
});

//api-routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on  http://localhost:${port}`);
});

module.exports = app;
