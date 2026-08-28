require("dotenv").config();
const express = require("express");
require("./config/db");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Route
app.get("/", (req, res) => {
    res.send("Server is running!");
});

//api-routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const challengeRoutes = require('./routes/challengeRoutes');
app.use('/api/challenges', challengeRoutes);
const applicationRoutes = require('./routes/applicationRoutes');
app.use('/api/applications', applicationRoutes);
const pilotRoutes = require('./routes/pilot.routes');
app.use('/api/pilots', pilotRoutes);
const evaluationRoutes = require('./routes/evaluationRoutes');
app.use('/api/evaluations', evaluationRoutes);
const validationRoutes = require('./routes/validationRoutes');
app.use('/api/validations', validationRoutes);



// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on  http://localhost:${port}`);
});

module.exports = app;
