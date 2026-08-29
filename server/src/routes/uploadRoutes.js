/**
 * GovCatalyst — File Upload Routes
 * Handles uploading evidence PDFs, invoices, CSV telemetry files, and agreements.
 */

const express = require('express');
const router  = express.Router();
const path    = require('path');
const fs      = require('fs');
const upload  = require('../middleware/uploadMiddleware');
const { formatSuccess, formatError } = require('../utils/responseFormatter');
const { authenticate } = require('../middleware/authMiddleware');

// ─────────────────────────────────────────────────────────────────
// SINGLE FILE UPLOAD
// POST /api/upload/single
// ─────────────────────────────────────────────────────────────────
router.post('/single', authenticate, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return formatError(res, err.message, 400);
    }
    if (!req.file) {
      return formatError(res, 'No file attached in request', 400);
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    return formatSuccess(res, {
      filename: req.file.filename,
      originalName: req.file.originalname,
      sizeBytes: req.file.size,
      mimetype: req.file.mimetype,
      fileUrl: fileUrl,
      uploadedAt: new Date().toISOString()
    }, 'File uploaded successfully', 201);
  });
});

// ─────────────────────────────────────────────────────────────────
// MULTIPLE FILES UPLOAD (Up to 10 files)
// POST /api/upload/multiple
// ─────────────────────────────────────────────────────────────────
router.post('/multiple', authenticate, (req, res) => {
  upload.array('files', 10)(req, res, (err) => {
    if (err) {
      return formatError(res, err.message, 400);
    }
    if (!req.files || req.files.length === 0) {
      return formatError(res, 'No files attached in request', 400);
    }

    const uploadedFiles = req.files.map(f => ({
      filename: f.filename,
      originalName: f.originalname,
      sizeBytes: f.size,
      mimetype: f.mimetype,
      fileUrl: `/uploads/${f.filename}`
    }));

    return formatSuccess(res, {
      count: uploadedFiles.length,
      files: uploadedFiles
    }, `${uploadedFiles.length} files uploaded successfully`, 201);
  });
});

// ─────────────────────────────────────────────────────────────────
// CSV TELEMETRY PARSER UPLOAD
// POST /api/upload/csv-telemetry
// ─────────────────────────────────────────────────────────────────
router.post('/csv-telemetry', authenticate, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) return formatError(res, err.message, 400);
    if (!req.file) return formatError(res, 'No CSV file attached', 400);

    const ext = path.extname(req.file.originalname).toLowerCase();
    if (ext !== '.csv') {
      return formatError(res, 'Only .csv files are supported for telemetry parsing', 400);
    }

    try {
      const filePath = req.file.path;
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);

      if (lines.length < 2) {
        return formatError(res, 'CSV file contains no data rows', 400);
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const records = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim());
        if (cols.length >= 2) {
          const rowObj = {};
          headers.forEach((h, idx) => {
            rowObj[h] = cols[idx] || '';
          });
          records.push(rowObj);
        }
      }

      return formatSuccess(res, {
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileUrl: `/uploads/${req.file.filename}`,
        totalRowsParsed: records.length,
        headers: headers,
        records: records
      }, `Parsed ${records.length} telemetry records from CSV`, 201);
    } catch (parseErr) {
      return formatError(res, `CSV Parsing Error: ${parseErr.message}`, 500);
    }
  });
});

module.exports = router;
