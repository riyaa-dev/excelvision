import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../features/axiosInstance';
import ChartRenderer from '../components/ChartRenderer';
import { useNavigate } from 'react-router-dom';

// Alert Component
const AlertNotification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`p-4 rounded-xl border backdrop-blur-sm shadow-2xl max-w-sm ${
        type === 'success' 
          ? 'bg-green-500/10 border-green-500/20 text-green-400' 
          : 'bg-red-500/10 border-red-500/20 text-red-400'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            <span className="text-lg">
              {type === 'success' ? '✅' : '❌'}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors ml-2"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

// Chart Collection Modal
const ChartCollectionModal = ({ isOpen, onClose, charts, onDeleteChart, onViewChart }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-slate-900 rounded-2xl border border-slate-700 max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <h2 className="text-2xl font-bold text-white">My Chart Collection</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {charts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {charts.map((chart, index) => (
                <div key={chart._id || index} className="bg-slate-800/50 rounded-xl p-4 border border-slate-600/50">
                  {/* Chart Preview */}
                  <div className="bg-white/5 rounded-lg p-4 mb-4 h-48">
                    <ChartRenderer
                      chartType={chart.chartType}
                      chartData={{
                        labels: chart.data?.map(item => item.x) || [],
                        datasets: [{
                          label: `${chart.yAxis} vs ${chart.xAxis}`,
                          data: chart.data?.map(item => item.y) || [],
                          backgroundColor: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'],
                          borderColor: '#8b5cf6',
                          borderWidth: 2,
                        }],
                      }}
                    />
                  </div>

                  {/* Chart Info */}
                  <div className="space-y-2 mb-4">
                    <h3 className="font-semibold text-white capitalize">
                      {chart.chartType} Chart
                    </h3>
                    <p className="text-sm text-slate-300">
                      <span className="text-purple-400">X-Axis:</span> {chart.xAxis}
                    </p>
                    <p className="text-sm text-slate-300">
                      <span className="text-purple-400">Y-Axis:</span> {chart.yAxis}
                    </p>
                  </div>

                  {/* Chart Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onViewChart(chart)}
                      className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 py-2 px-3 rounded-lg transition-colors text-sm font-medium"
                    >
                      👁️ View
                    </button>
                    <button
                      onClick={() => onDeleteChart(chart._id)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 px-3 rounded-lg transition-colors text-sm font-medium"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Charts Saved Yet</h3>
              <p className="text-slate-400">
                Create and save your first chart to see it in your collection.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // State
  const [file, setFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [message, setMessage] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [savedCharts, setSavedCharts] = useState([]);
  const [showChartCollection, setShowChartCollection] = useState(false);

  // API Functions
  const fetchHistory = async () => {
    try {
      const res = await axiosInstance.get('/upload/history');
      setHistory(res.data || []);
    } catch (err) {
      console.error('Error fetching history:', err);
      setHistory([]);
    }
  };

  const fetchSavedCharts = async () => {
    try {
      const res = await axiosInstance.get('/chart/collection');
      setSavedCharts(res.data || []);
    } catch (err) {
      console.error('Error fetching charts:', err);
      setSavedCharts([]);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchSavedCharts();
  }, []);

  // Event Handlers
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axiosInstance.post('/upload', formData);
      setParsedData(res.data.upload.data || []);
      fetchHistory();
      setFile(null);
      setMessage('Upload successful!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Upload failed.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSaveChart = async () => {
    if (!xAxis || !yAxis || parsedData.length === 0) return;

    try {
      await axiosInstance.post("/chart/save", {
        xAxis,
        yAxis,
        chartType,
        data: parsedData.map(row => ({
          x: row[xAxis],
          y: row[yAxis],
        }))
      });

      fetchSavedCharts();
      setAlert({
        show: true,
        message: `🎉 Chart saved successfully!`,
        type: 'success'
      });
    } catch (err) {
      setAlert({
        show: true,
        message: '❌ Failed to save chart.',
        type: 'error'
      });
    }
  };

  const handleDeleteChart = async (chartId) => {
    if (!window.confirm('Are you sure you want to delete this chart?')) return;

    try {
      await axiosInstance.delete(`/chart/${chartId}`);
      fetchSavedCharts();
      setAlert({
        show: true,
        message: '🗑️ Chart deleted successfully!',
        type: 'success'
      });
    } catch (err) {
      setAlert({
        show: true,
        message: '❌ Failed to delete chart.',
        type: 'error'
      });
    }
  };

  const handleViewChart = (chart) => {
    setParsedData(chart.data || []);
    setChartType(chart.chartType);
    setXAxis(chart.xAxis);
    setYAxis(chart.yAxis);
    setShowChartCollection(false);
    
    setAlert({
      show: true,
      message: `📊 Chart loaded successfully!`,
      type: 'success'
    });
  };

  const closeAlert = () => {
    setAlert({ show: false, message: '', type: '' });
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Alert */}
      {alert.show && (
        <AlertNotification
          message={alert.message}
          type={alert.type}
          onClose={closeAlert}
        />
      )}

      {/* Chart Collection Modal */}
      <ChartCollectionModal
        isOpen={showChartCollection}
        onClose={() => setShowChartCollection(false)}
        charts={savedCharts}
        onDeleteChart={handleDeleteChart}
        onViewChart={handleViewChart}
      />

      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-400">ExcelVision</h1>
          
          <div className="flex items-center gap-4">
            {/* View Collection Button */}
            <button
              onClick={() => {
                fetchSavedCharts();
                setShowChartCollection(true);
              }}
              className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg transition-colors font-medium"
            >
              📊 My Charts ({savedCharts.length})
            </button>
            
            <span className="text-slate-300">
              Welcome, {user?.name || 'User'}
            </span>
            <button
              onClick={handleLogout}
              className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4 text-purple-400">
            Analytics Dashboard
          </h2>
          <p className="text-xl text-slate-300">
            Upload Excel files and create beautiful charts
          </p>
        </div>

        {/* Collection Quick Access */}
        <div className="mb-8 bg-slate-900 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Chart Collection</h3>
                <p className="text-slate-400">
                  {savedCharts.length > 0 
                    ? `You have ${savedCharts.length} saved charts`
                    : 'No charts saved yet'
                  }
                </p>
              </div>
            </div>
            
            <button
              onClick={() => {
                fetchSavedCharts();
                setShowChartCollection(true);
              }}
              className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-xl font-semibold transition-colors"
              disabled={savedCharts.length === 0}
            >
              📊 View Collection ({savedCharts.length})
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.includes('successful') 
              ? 'bg-green-500/10 text-green-400' 
              : 'bg-red-500/10 text-red-400'
          }`}>
            <p className="text-center font-medium">{message}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Panel */}
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-slate-900 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Upload Excel File</h3>
              <div className="space-y-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500 file:text-white cursor-pointer"
                  accept=".xlsx,.xls,.csv"
                />
                <button
                  onClick={handleUpload}
                  disabled={!file}
                  className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {file ? `Upload ${file.name}` : 'Select a file'}
                </button>
              </div>
            </div>

            {/* History */}
            <div className="bg-slate-900 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Upload History</h3>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                >
                  {showHistory ? 'Hide' : 'Show'}
                </button>
              </div>

              {showHistory && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {history.length > 0 ? (
                    history.map((item, index) => (
                      <div key={index} className="p-3 bg-slate-800 rounded-lg">
                        <span className="text-slate-300 text-sm">{item.originalName}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-center py-4">No uploads yet</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Chart Panel */}
          <div className="lg:col-span-2">
            {parsedData.length > 0 ? (
              <div className="bg-slate-900 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Data Visualization</h3>

                {/* Configuration */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Chart Type</label>
                    <select
                      value={chartType}
                      onChange={(e) => setChartType(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white"
                    >
                      <option value="bar">📊 Bar Chart</option>
                      <option value="line">📈 Line Chart</option>
                      <option value="pie">🥧 Pie Chart</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">X-Axis</label>
                    <select
                      value={xAxis}
                      onChange={(e) => setXAxis(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white"
                    >
                      <option value="">Select X-Axis</option>
                      {Object.keys(parsedData[0] || {}).map((key) => (
                        <option key={key} value={key}>{key}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Y-Axis</label>
                    <select
                      value={yAxis}
                      onChange={(e) => setYAxis(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white"
                    >
                      <option value="">Select Y-Axis</option>
                      {Object.keys(parsedData[0] || {}).map((key) => (
                        <option key={key} value={key}>{key}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Chart Display */}
                {xAxis && yAxis && (
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-xl p-6">
                      <ChartRenderer
                        chartType={chartType}
                        chartData={{
                          labels: parsedData.map((row) => row[xAxis]),
                          datasets: [{
                            label: `${yAxis} vs ${xAxis}`,
                            data: parsedData.map((row) => row[yAxis]),
                            backgroundColor: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'],
                            borderColor: '#8b5cf6',
                            borderWidth: 2,
                          }],
                        }}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={handleSaveChart}
                        className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-xl font-semibold transition-colors"
                      >
                        💾 Save Chart
                      </button>
                      <button
                        onClick={() => {
                          fetchSavedCharts();
                          setShowChartCollection(true);
                        }}
                        className="bg-indigo-500 hover:bg-indigo-600 px-6 py-3 rounded-xl font-semibold transition-colors"
                      >
                        📊 View Collection
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-900 rounded-2xl p-12 text-center">
                <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Ready for Data</h3>
                <p className="text-slate-400 mb-6">
                  Upload an Excel file to start creating visualizations
                </p>
                {savedCharts.length > 0 && (
                  <button
                    onClick={() => {
                      fetchSavedCharts();
                      setShowChartCollection(true);
                    }}
                    className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    📊 View My Charts ({savedCharts.length})
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
