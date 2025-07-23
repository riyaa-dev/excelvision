import React, { useState, useEffect } from 'react';
import axiosInstance from "../features/axiosInstance";
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const { user } = useSelector((state) => state.auth);
  const [file, setFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');

  // Load upload history
  const loadHistory = async () => {
    try {
      const res = await axiosInstance.get('/data/history'); 
      setHistory(res.data);
    } catch (err) {
      console.log('History fetch failed:', err.response?.data?.message || err?.message ||err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Upload Excel file
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axiosInstance.post('/data/upload', formData); // ✅ fixed
      setMessage(res.data.message);
      loadHistory(); // refresh list
    } catch (err) {
      setMessage("Upload failed: " + err.response?.data?.message);
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
        {history.length > 0 ? (
          history.map((item) => (
            <li key={item._id}>
              📄 {item.fileName} —{" "}
              <span className="text-sm text-gray-600">
                {new Date(item.uploadedAt).toLocaleString()}
              </span>
            </li>
          ))
        ) : (
          <p>No uploads yet.</p>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
