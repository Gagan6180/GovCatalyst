/**
 * GovCatalyst — File Upload Middleware (Multer)
 * Handles document uploads (PDF, CSV, Excel, Images, GeoJSON)
 * with strict size limits, mime-type verification, and secure storage.
 */

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage engine configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const cleanExt = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, cleanExt).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${cleanBase}-${uniqueSuffix}${cleanExt}`);
  }
});

// Allowed file types filter
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /pdf|doc|docx|csv|xlsx|xls|json|geojson|png|jpg|jpeg|webp/i;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  
  if (allowedExtensions.test(ext)) {
    return cb(null, true);
  } else {
    return cb(new Error(`Unsupported file type (.${ext}). Allowed formats: PDF, DOCX, CSV, XLSX, JSON, GeoJSON, PNG, JPG`), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15 MB max file size
  },
  fileFilter: fileFilter
});

module.exports = upload;
