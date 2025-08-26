"use client"

import { supabase } from '../app/lib/supabaseClient'
import React,{ useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TextField from '@mui/material/TextField';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css'; 


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
import { useChartContext } from "../context/ChartContext";

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
  const [searchValue, setSearchValue] = useState("")
  const rawSideMenuOption = ["SwitchButton", "Calender", "Search"]
  const [sideMenuOption, setSideMenuOption] = useState(rawSideMenuOption[0])
  const [testResults, setTestResults] = useState([])
  const [filterSpanOpen, setFilterSpanOpen] = useState(false)



  const { keywordMapping } = useBloodTestContext();
  const { dateFilter, dateRangeRaw, handleDateRangePicker } = useChartContext();
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
      .filter(item => {
        const itemDate = new Date(item.test_date);

        const [startMonth, startYear] = dateFilter.startDate.split(".").map(Number);
        const [endMonth, endYear] = dateFilter.endDate.split(".").map(Number);

        const start = new Date(startYear, startMonth - 1, 1); // first day of month
        const end = new Date(endYear, endMonth, 0, 23, 59, 59); // last day of month

        return itemDate >= start && itemDate <= end;
      })
      .sort((a, b) => new Date(a.test_date) - new Date(b.test_date)) 
      .map(item => {
        const monthDate = new Date(item.test_date);
        const month = String(monthDate.getMonth() + 1).padStart(2, '0');
        const year = monthDate.getFullYear();

        let result = { date: `${month}.${year}` };
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
      });

      console.log("testResults", testResults_func);
      setTestResults(testResults_func);
    };

    fetchData();
  }, [dateFilter]);


  const labels = testResults.map((r) => r.date);

  // const allMetrics = ['a_kaliumVal', 'a_Kreatinin'];
  const allMetrics = keywordMapping.map(item => item.key); 
  const [visibleMetrics, setVisibleMetrics] = useState(allMetrics);

  const toggleMetric = (metric) => {
    setVisibleMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric]
    );
  };

  // const datasetColors = {
  //   b_gesamtProteinVal: 'green',
  //   a_Kreatinin: 'pink'
  // };

  const generateColors = (keys) => {
    const colors = {};
    const step = 360 / keys.length; // evenly space hues

    keys.forEach((key, i) => {
      const hue = Math.round(i * step); 
      colors[key] = `hsl(${hue}, 50%, 40%)`;
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

      <div className='wrapper'>
        <h1 className='identifier'>Main Chart</h1>
        <div className='chart-grand'>
          <div className="filter-container">
            <div className='menu-navi'>
              {filterSpanOpen && ( 
                <div className="space-between">
                  <SearchOutlinedIcon onClick={() => {
                    setSearchValue("")
                    setSideMenuOption(rawSideMenuOption[2])} 
                  } /> 
                  <TuneOutlinedIcon onClick={() => {
                    setSearchValue("")
                    setSideMenuOption(rawSideMenuOption[0])}
                    } /> 
                  <CalendarMonthOutlinedIcon className="calender" onClick={() => {
                    setSearchValue("")
                    setSideMenuOption(rawSideMenuOption[1])}} //calender
                  /> 
                </div>
              )}
              <span 
                  onClick={() => {setFilterSpanOpen(prev => !prev)}}
                  className='filter-menu'
                > 
                  {filterSpanOpen ? <> Filter <KeyboardArrowLeftIcon /> </> : <KeyboardArrowRightIcon />}
              </span>
            </div>
            
            <div className={`full-height ${filterSpanOpen ? "show" : "hide"}`}>
             {sideMenuOption === "Calender" && (
                <div className="calender noColorChange">
                  <DateRangePicker
                    onChange={handleDateRangePicker}
                    value={dateRangeRaw}
                  />
                </div>
              )}

              {sideMenuOption === "Search" && (
                <TextField
                  className="searchMUI"
                  size="small"
                  sx={{
                    input: { color: "white" },
                    label: { color: "white" },
                    "& .MuiFilledInput-root": {
                      backgroundColor: "#222",
                      "&:hover": { backgroundColor: "#333" },
                      "&.Mui-focused": {
                        backgroundColor: "#333",
                        borderColor: "white"
                      }
                    }
                  }}
                  id="filled-search"
                  label="Search field"
                  type="search"
                  variant="filled"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              )}

              {sideMenuOption === "SwitchButton" && (
                <div className="btn-main-switch">
                  <button
                    onClick={() => setVisibleMetrics([])}
                    className="filter-controller"
                    style={{ backgroundColor: "gray", color: "white" }}
                  >
                    Hide All
                  </button>

                  <button
                    onClick={() => setVisibleMetrics(allMetrics)}
                    className="filter-controller"
                    style={{ backgroundColor: "black", color: "white" }}
                  >
                    Show All
                  </button>
                </div>
              )}
              
              <div className='button-rainbow-container'>

                { allMetrics.map((metric) => (
                  searchValue ? (metric.includes(searchValue) && <button
                    key={metric}
                    onClick={() => toggleMetric(metric)}
                    className={visibleMetrics.includes(metric) ? "filter-on" : "filter-off"}
                    style={{
                      backgroundColor: datasetColors[metric], // use your generated color
                      color: "white", // ensure text is readable
                      width: "100%",
                    }}
                  >
                    {metric}
                  </button>) :
                  <button
                    key={metric}
                    onClick={() => toggleMetric(metric)}
                    className={visibleMetrics.includes(metric) ? "filter-on" : "filter-off"}
                    style={{
                      backgroundColor: datasetColors[metric], // use your generated color
                      color: "white", // ensure text is readable
                      width: "100%",
                    }}
                  >
                    {metric}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className={`chart-body ${!filterSpanOpen && "full-width"} `}>
            <Line data={data}  options={{ maintainAspectRatio: false }} />
          </div>
          
        </div>
      </div>


      <div >

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
