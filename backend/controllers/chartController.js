// controllers/chartController.js

const Chart = require('../models/ChartModel');

// @desc    Save chart configuration
// @route   POST /api/chart/save
// @access  Private
const saveChart = async (req, res) => {
  try {
    const { userId, chartType, xAxis, yAxis, data } = req.body;

    if (!userId || !chartType || !xAxis || !yAxis || !data) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newChart = new Chart({ user: userId, chartType, xAxis, yAxis, data });
    await newChart.save();

    res.status(201).json({ message: 'Chart saved successfully', chart: newChart });
  } catch (error) {
    console.error('Error saving chart:', error);
    res.status(500).json({ message: 'Server error while saving chart' });
  }
};

module.exports = { saveChart };
