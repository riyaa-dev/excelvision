const express = require('express');
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { uploadExcel, getUploadHistory } = require("../controllers/uploadController");

// Upload Excel file
router.post("/upload", auth, upload.single('file'), uploadExcel);

// Get upload history
router.get("/history", auth, getUploadHistory);

module.exports = router;
