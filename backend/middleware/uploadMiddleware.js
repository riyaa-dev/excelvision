const multer = require("multer");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

// File filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext === ".xlsx" || ext === ".xls") {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only Excel files are allowed"), false); // Reject file
  }
};

// Export upload middleware
const upload = multer({ storage, fileFilter });
module.exports = upload;
