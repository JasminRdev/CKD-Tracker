import React, { useState } from 'react';
import './Chart.css';
import './style.css';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';


const backgroundRangePlugin = {
  id: 'backgroundRange',
  beforeDraw: (chart) => {
    const { ctx, chartArea, scales } = chart;
    const yAxis = scales.y;

    if (!chart.config.options.rangeFill) return;

    const { min, max, color } = chart.config.options.rangeFill;

    const yMin = yAxis.getPixelForValue(max); // top pixel
    const yMax = yAxis.getPixelForValue(min); // bottom pixel

    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(chartArea.left, yMin, chartArea.right - chartArea.left, yMax - yMin);
    ctx.restore();
  },
};

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  backgroundRangePlugin
);


const Chart = () => {
  const testResults = [
    { date: '01', Kreatinin: 139, Protein: 62.5 },
    { date: '02', Kreatinin: 139, Protein: 62.5 },
    { date: '03', Kreatinin: 133, Protein: 62.5 },
    { date: '05', Kreatinin: 135, Protein: 62 },
    { date: '07', Kreatinin: 133, Protein: 62 },
  ];

  const labels = testResults.map((r) => r.date);

  const allMetrics = ['Kreatinin', 'Protein'];
  const [visibleMetrics, setVisibleMetrics] = useState(allMetrics);

  const toggleMetric = (metric) => {
    setVisibleMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric]
    );
  };

  const datasetColors = {
    Kreatinin: 'red',
    Protein: 'blue',
  };

  const datasets = visibleMetrics.map((metric) => ({
    label: metric,
    data: testResults.map((r) => r[metric]),
    borderColor: datasetColors[metric],
  }));

  const data = { labels, datasets };

  return (
    <div>   
        <div className='chart-body'>
            <h1>Main Chart</h1>
            {allMetrics.map((metric) => (
                <button className={visibleMetrics.includes(metric) ? `filter-on` : `filter-off`} 
                key={metric} onClick={() => toggleMetric(metric)}>
                 {metric}
                </button>
            ))}

            <Line data={data}  options={{ maintainAspectRatio: false }} />

            <br></br>

            <h1>Separate Charts</h1>
            
    <div className="separate-chart">
            {allMetrics.map((metric) => {
                 const normRanges = {
    Protein: { min: 57, max: 94 },
    Kreatinin: { min: 0, max: 168 },
  };

  const data = {
    labels,
    datasets: [
      {
        label: metric,
        data: testResults.map((r) => r[metric]),
        borderColor: datasetColors[metric],
        fill: false,
      },
    ],
  };

  const range = normRanges[metric];
const yMin = range.min - (range.max*0.3);
const yMax = range.max + (range.max*0.3);

const options = {
  maintainAspectRatio: false,
  rangeFill: {
    min: range.min,
    max: range.max,
    color: 'rgba(0, 200, 0, 0.15)', // light green background
  },
  plugins: {
    title: {
      display: true,
      text: metric,
    },
  },
  scales: {
    y: {
      beginAtZero: false,
      min: yMin,
      max: yMax,
    },
  },
};

  return (
    <div className="comp-wrapper">
      <h1>Chart comp</h1>
    <div key={metric} className="chart-wrapper ">
      <Line data={data} options={options} />
    </div>
    </div>
  );
})}

        </div>
        </div>
    </div>
  );
};

export default Chart;
