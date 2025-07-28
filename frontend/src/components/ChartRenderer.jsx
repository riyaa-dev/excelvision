import React from "react";
import React,{useRef} from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart elements
ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const ChartRenderer = ({ chartType, chartData }) => {

  const chartRef = useRef(null);
  const handleDownload = () => {
    if (chartRef.current){
      const canvas = chartRef.current.canvas 
      const link = document .createElement("a");
      link.href = canvas.toDataUrl("image/png");
      link.download = "chart.png";
      link.click();
    
    }
  }
  // Common options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Excel Chart" },
    },
  };

  // Handle if chartData is not properly passed
  if (!chartData?.labels || !chartData?.datasets) {
    return <p className="text-red-500">Invalid chart data</p>;
  }

  // Conditional chart rendering
  switch (chartType) {
    case "bar":
      return <Bar data={chartData} options={chartOptions} />;

    case "line":
      return <Line data={chartData} options={chartOptions} />;

    case "pie": {
      // Only use the first dataset for pie (Chart.js does not support multiple datasets in Pie)
      const pieData = {
        labels: chartData.labels,
        datasets: [
          {
            label: chartData.datasets[0].label,
            data: chartData.datasets[0].data,
            backgroundColor: chartData.datasets[0].backgroundColor || [
              "#3b82f6",
              "#10b981",
              "#f59e0b",
              "#ef4444",
              "#6366f1",
              "#8b5cf6",
              "#ec4899",
              "#22d3ee",
            ],
          },
        ],
      };
      return <Pie data={pieData} options={chartOptions} />;
    }

    default:
      return <p className="text-red-500">Unsupported chart type</p>;
  }
};

export default ChartRenderer;
