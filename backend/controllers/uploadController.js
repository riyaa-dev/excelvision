const XLSX = require("xlsx");
const fs = require('fs');
const Upload = require('../models/Upload');

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

    const upload = await Upload.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      data,
    });

    fs.unlinkSync(filePath); // remove file after reading
    res.status(200).json({ message: 'File uploaded & parsed!', upload });
  } catch (err) {
    res.status(500).json({ message: "Failed to upload", error: err.message });
  }
};

exports.getUploadHistory = async (req, res) => {
  try {
    const uploads = await Upload.find({ userId: req.user.id }).sort({ uploadedAt: -1 });
    res.status(200).json(uploads); // Make sure this is an array
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
