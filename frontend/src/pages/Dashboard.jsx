import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);  
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      const res = await axios.get('/data/history');
      setHistory(res.data); // Make sure API returns an array
    } catch (err) {
      console.error("History fetch failed:", err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post('/data/upload', formData);
      setMessage(res.data.message);
      setFile(null); // optional reset
      loadHistory(); // Refresh history
    } catch (err) {
      setMessage('Upload failed: ' + err.response?.data?.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h1>

      <form onSubmit={handleUpload} className="mb-6">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-2"
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Upload Excel
        </button>
      </form>

      {message && <p className="text-blue-500 mb-4">{message}</p>}

      <h2 className="text-lg font-semibold mb-2">Upload History</h2>
      <ul className="list-disc pl-6">
        {Array.isArray(history) && history.length > 0 ? (
          history.map((item) => (
            <li key={item._id}>
              📄 {item.fileName} —{" "}
              <span className="text-sm text-gray-600">
                {new Date(item.uploadedAt).toLocaleString()}
              </span>
            </li>
          ))
        ) : loading ? (
          <p>Loading history...</p>
        ) : (
          <p>No uploads yet.</p>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
