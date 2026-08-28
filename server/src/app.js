require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
require("./config/db");

const app = express();
const port = process.env.PORT || 5009;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
app.use('/client', express.static(path.join(__dirname, '../../client')));
app.use('/docs', express.static(path.join(__dirname, '../../docs')));
app.use(express.static(path.join(__dirname, '../../client')));

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ success: true, status: "HEALTHY", message: "GovCatalyst API is running" });
});

// Basic Route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/index.html'));
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



// Start the server if started directly
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

module.exports = app;
