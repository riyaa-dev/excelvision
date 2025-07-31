
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

      link.download = "chart.png";
      link.href = chartRef.current.toBase64Image();

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

  

  // Conditional chart rendering
const renderChart = () => {
  const props = { data: chartData, options: chartOptions, ref: chartRef };

  switch (chartType) {
    case "bar":
      return <Bar {...props} />;
    case "line":
      return <Line {...props} />;
    case "pie":
      const pieData = {
        labels: chartData.labels,
        datasets: [
          {
            label: chartData.datasets[0].label,
            data: chartData.datasets[0].data,
            backgroundColor:
              chartData.datasets[0].backgroundColor || defaultColors,
          },
        ],
      };
      return <Pie data={pieData} options={chartOptions} ref={chartRef} />;
    default:
      return <p className="text-red-500">Unsupported chart type</p>;
  }
};

// Handle if chartData is not properly passed
  if (!chartData?.labels || !chartData?.datasets) {
    return <p className="text-red-500">Invalid chart data</p>;
  }

  return (
    <div className="space-y-4">
      <button onClick={handleDownload}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"> Download Chart</button>
      {renderChart()}
    </div>
  );
};
<button
  onClick={handleSaveChart}
  className="bg-purple-600 text-white px-4 py-2 rounded"
>
  Save Chart
</button>



export default ChartRenderer;
