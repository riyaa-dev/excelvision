import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../features/axiosInstance';
import ChartRenderer from '../components/ChartRenderer';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const [file, setFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [message, setMessage] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');

  const fetchHistory = async () => {
    try {
      const res = await axiosInstance.get('/upload/history');
      setHistory(res.data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axiosInstance.post('/upload', formData);
      setParsedData(res.data.upload.data); // Excel parsed data
      fetchHistory();
      setFile(null);
      setMessage('Upload successful!');
    } catch (err) {
      setMessage('Upload failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Welcome, {user?.name || 'User'}
        </h2>

        {message && (
          <p className="text-center text-green-600 mb-4">{message}</p>
        )}

        {/* Upload Excel */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
          />
          <button
            onClick={handleUpload}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg transition"
          >
            Upload Excel
          </button>
        </div>

        {/* Toggle History */}
        <div className="text-center mb-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-purple-600 hover:underline font-medium"
          >
            {showHistory ? 'Hide Upload History' : 'Show Upload History'}
          </button>
        </div>

        {/* Upload History List */}
        {showHistory && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Upload History
            </h3>
            {history.length > 0 ? (
              <ul className="space-y-2 list-disc list-inside text-gray-700">
                {history.map((item, index) => (
                  <li key={index}>{item.originalName}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No uploads yet.</p>
            )}
          </div>
        )}

        {/* Chart Dropdowns */}
        {parsedData.length > 0 ? (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Visualize Excel Data
            </h3>

            <div className="flex flex-wrap gap-4 mb-4">
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="border px-3 py-2 rounded"
              >
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="pie">Pie</option>
              </select>

              <select
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)}
                className="border px-3 py-2 rounded"
              >
                <option value="">Select X</option>
                {Object.keys(parsedData[0]).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>

              <select
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
                className="border px-3 py-2 rounded"
              >
                <option value="">Select Y</option>
                {Object.keys(parsedData[0]).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>

            {/* Chart Rendering */}
            {xAxis && yAxis && parsedData.length > 0 &&
              parsedData[0][xAxis] !== undefined &&
              parsedData[0][yAxis] !== undefined && (
                <ChartRenderer
                  chartType={chartType}
                  chartData={{
                    labels: parsedData.map((row) => row[xAxis]),
                    datasets: [
                      {
                        label: `${yAxis} vs ${xAxis}`,
                        data: parsedData.map((row) => row[yAxis]),
                        backgroundColor: [
                          '#3b82f6',
                          '#10b981',
                          '#f59e0b',
                          '#ef4444',
                          '#6366f1',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              )}
          </div>
          
        ) : (
          <p className="text-center text-gray-500 mt-6">
            Upload Excel file to see chart.
          </p>
          
        )}
      </div>
    </div>
  );
};

export default Dashboard;
