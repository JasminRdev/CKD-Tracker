"use client"

import { supabase } from '../app/lib/supabaseClient'
import React, { useState, useEffect } from 'react';
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

import { useBloodTestContext } from "../context/BloodTestContext";


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
  const [testResults, setTestResults] = useState([])

  const { keywordMapping } = useBloodTestContext();
  // setTestResults([
  //   { date: '01', Kreatinin: 139, Protein: 62.5, 
  //   b_gesamtProteinVal: 139, a_Kreatinin: 62.5 },
  //   { date: '02', Kreatinin: 139, Protein: 62.5 ,
  //   b_gesamtProteinVal: 133, a_Kreatinin: 62.5 },
  //   { date: '03', Kreatinin: 133, Protein: 62.5 },
  //   { date: '05', Kreatinin: 135, Protein: 62 },
  //   { date: '07', Kreatinin: 133, Protein: 62 },
  // ]);

    //::TODO add select only user_id data that matches our user.id
  const getBloodTestData = async () => {
    let { data: testResult_data, error } = await supabase
      .from('testResult_data')
      .select('*');
  
    if (error) {
      console.error('Supabase error:', error);
      return null;
    }
  
    return testResult_data;
  };
  
  useEffect(() => {
  const fetchData = async () => {
    const rawData = await getBloodTestData();

    const testResults_func = rawData
      .filter(item => new Date(item.test_date).getFullYear() === 2025) 
      .map(item => {
        const monthDate = new Date(item.test_date);
        const month = String(monthDate.getMonth() + 1).padStart(2, '0');

        const result = { date: month }; 

        // Convert array of JSON strings to object
        item.data.forEach(str => {
          const { name, value } = JSON.parse(str);

          if (value !== "") {
            // convert to number if possible
            const numValue = isNaN(value) ? value : parseFloat(value);
            result[name] = numValue;
          }
        });

        return result;
      })
      .sort((a, b) => Number(a.date) - Number(b.date));

      console.log("testResults", testResults_func);
      setTestResults(testResults_func);
    };

    fetchData();
  }, []);



  const labels = testResults.map((r) => r.date);

  // const allMetrics = ['a_kaliumVal', 'a_Kreatinin'];
  const allMetrics = keywordMapping.map(item => item.key); //  const allMetrics = keywordMapping.map(item => item.keyword[0]);
  console.log("allMetrics", allMetrics)
  const [visibleMetrics, setVisibleMetrics] = useState(allMetrics);

  const toggleMetric = (metric) => {
    setVisibleMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric]
    );
  };

  
  // const datasetColors = {
  //   Kreatinin: 'red',
  //   Protein: 'blue',
  //   b_gesamtProteinVal: 'green',
  //   a_Kreatinin: 'pink'
  // };

  const generateColors = (keys) => {
    const colors = {};
    const step = 360 / keys.length; // evenly space hues

    keys.forEach((key, i) => {
      const hue = Math.round(i * step); 
      colors[key] = `hsl(${hue}, 50%, 50%)`;
    });

    return colors;
  };
  const datasetColors = generateColors(allMetrics);
  console.log("datasetColors" ,datasetColors);

  const datasets = visibleMetrics.map((metric) => ({
    label: metric,
    data: testResults.map((r) => r[metric]),
    borderColor: datasetColors[metric],
    spanGaps: true 
  }));

  const data = { labels, datasets };

  return (
    <div>   
      <div className='chart-body'>
        <h1 className='identifier'>Main Chart</h1>
        <div className="filter-container">Filters
          <div className='btn-main-switch'>
            <button
              onClick={() => setVisibleMetrics([])}
              className="filter-off"
              style={{
                backgroundColor: "gray",
                color: "white",
                marginBottom: "1rem",
              }}
            >
              Hide All
            </button>

            <button
              onClick={() => setVisibleMetrics(allMetrics)}
              className="filter-on"
              style={{
                backgroundColor: "black",
                color: "white",
                marginBottom: "1rem",
              }}
            >
              Show All
            </button>
          </div>
          {allMetrics.map((metric) => (
            <button
              key={metric}
              onClick={() => toggleMetric(metric)}
              className={visibleMetrics.includes(metric) ? "filter-on" : "filter-off"}
              style={{
                backgroundColor: datasetColors[metric], // use your generated color
                color: "white" // ensure text is readable
              }}
            >
              {metric}
            </button>
          ))}
        </div>

        <Line data={data}  options={{ maintainAspectRatio: false }} />

        <br></br>

        <h1 className='identifier'>Separate Charts</h1>
        
        <div className="separate-chart">
          {allMetrics
            .sort((a, b) => {
              const aHasData = testResults.some(r => r[a] !== undefined && r[a] !== null);
              const bHasData = testResults.some(r => r[b] !== undefined && r[b] !== null);

              // Sort: metrics with data first
              if (aHasData && !bHasData) return -1;
              if (!aHasData && bHasData) return 1;
              return 0; // keep original order if both same
            })
            .map((metric) => {
            const normRanges = Object.fromEntries(
              keywordMapping.map(item => [
                item.key, //keyword as lable
                { 
                  min: item.min ?? item.value + 50, 
                  max: item.max ?? item.value - 50 
                }
              ])
            );

            const data = {
              labels,
              datasets: [
                {
                  label: metric,
                  data: testResults.map((r) => r[metric]),
                  borderColor: datasetColors[metric],
                  fill: false,
                  spanGaps: true 
                },
              ],
            };

            const range = normRanges[metric];
            const yMin = range.min - (range.max*0.3);
            const yMax = range.max + (range.max*0.3);
            //range of min max val from blood test acceptance
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
              <div key={metric} className="comp-wrapper">
                <h1 className='identifier'>Chart comp</h1>
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
