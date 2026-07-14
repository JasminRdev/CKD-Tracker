"use client"

import { supabase } from '../app/lib/supabaseClient'
import React,{ useState, useEffect } from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TextField from '@mui/material/TextField';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { useInView } from "react-intersection-observer";

import { useFormStore } from "../app/stores/useFormStore";

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
  Colors
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import ChartDataLabels from "chartjs-plugin-datalabels";
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from "@mui/material/Autocomplete";
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import Button from '@mui/material/Button';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import InputAdornment from "@mui/material/InputAdornment";

import { useBloodTestContext } from "../context/BloodTestContext";
import { useChartContext } from "../context/ChartContext";

import { useSepaFilterStore } from "../app/stores/useSepaFilterStore";


import PetNameInput from './fields/PetNameInput'

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
  backgroundRangePlugin,
  ChartDataLabels,
  Colors
);

const Chart = () => {

  const { getForm } = useFormStore()
  const [searchValue, setSearchValue] = useState("")
  const [searchSepaChart, setSearchSepaChart] = useState("");
  const rawSideMenuOption = ["SwitchButton", "Calender", "Search"]
  const [sideMenuOption, setSideMenuOption] = useState(rawSideMenuOption[0])
  const [filterSpanOpen, setFilterSpanOpen] = useState(false)
  const [showLegend, setShowLegend] = useState(true)
  
  const { search, setSearch, filters, removeFilter, clearFilters, addFilter } = useSepaFilterStore()

  const { chosenPetName } = useBloodTestContext();
  const { dateRangeRaw, handleDateRangePicker, testResults, generateColors } = useChartContext();

  const labels = testResults.map((r) => r.date);

  // const allMetrics = ['a_kaliumVal', 'a_Kreatinin'];
  const allMetrics = getForm.map(item => item.name); 
  const [visibleMetrics, setVisibleMetrics] = useState(allMetrics);

  const { ref, inView } = useInView({
    rootMargin: "80px 0px 0px 0px",
    threshold: 0,
  });

  const toggleMetric = (metric) => {
    setVisibleMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric]
    );
  };

  useEffect(() => {
    const handleResize = () => {
      setShowLegend(window.innerWidth > 600);
    };
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    
  }, []);

  useEffect(() => {
      setVisibleMetrics(allMetrics);
      
  }, [chosenPetName, getForm]);
  
  // const datasetColors = {
  //   b_gesamtProteinVal: 'green',
  //   a_Kreatinin: 'pink'
  // };
  const datasetColors = generateColors(allMetrics);

  const datasets = visibleMetrics.map((metric) => ({
    label: metric,
    data: testResults.map((r) => r[metric]),
    borderColor: datasetColors[metric],
    backgroundColor: datasetColors[metric],
    spanGaps: true 
  }));
  

  const data = { labels, datasets };

  return (
    <div> 
       <div className='petNameInput__wrapper'>
        <PetNameInput />
      </div>
      
    {
      chosenPetName &&
      <div>
        <div className='wrapper' ref={ref}>
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
            <Line data={data}  options={{ maintainAspectRatio: false, 
            plugins: {
              legend: {
                  display: showLegend,
              },
              colors: {
                enabled: false
              },
              datalabels: {
                color: "transparent",},}}
              }
            />
          </div>
        </div>
      </div>
      <div className="sepa-chart__wrapper" >
        <h1 className='identifier'>Separate Charts</h1>

        <div 
          
          className={`filter-badge-wrapper ${inView ? "inView" : "outView"}`}
        >
          <div className='filter-badge-group'>
            <div className='filter-badge-add'>
              <Autocomplete
                className='filter-badge-input'
                freeSolo
                options={allMetrics}
                inputValue={search}
                onInputChange={(event, newInputValue) => {
                  setSearch(newInputValue);
                }}
                onChange={(event, value) => {
                  if (value && !filters.includes(value.toLowerCase())) {
                    addFilter(value.toLowerCase());
                    setSearch("");
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add multiple filter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const value = search.trim().toLowerCase();

                        if (value && !filters.includes(value)) {
                          addFilter(value);
                          setSearch("");
                        }
                      }
                    }}
                  />
                )}
              />
              <Button 
                variant="contained" 
                onClick={() => {
                  const value = search.trim().toLowerCase();
                  if (value && !filters.includes(value)) {
                    addFilter(value);
                    setSearch("");
                  }
                }}
                endIcon={<LibraryAddIcon />}>
                <div className='filter-badge-text'>Add</div>
              </Button>
            </div>

            <Button 
              variant="outlined" 
              onClick={clearFilters}
              endIcon={<RemoveCircleIcon />}>
              <div className='filter-badge-text'>Remove&nbsp;</div> all
            </Button>

          </div>
          
          <TextField 
            id="standard-basic" 
            label="Seach value" 
            value={searchSepaChart}
            onChange={(e) => setSearchSepaChart(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
        
        <div className="filter-badges">
          {filters.map((filter) => (
            <Button 
              variant="contained" 
              key={filter}
              onClick={() => removeFilter(filter)}
              className="badge"
              endIcon={<RemoveCircleIcon />}>
              {filter}
            </Button>
          ))}
        </div>

        <div className="separate-chart">
          {allMetrics
            .filter((metric) =>
              metric.toLowerCase().includes(searchSepaChart.toLowerCase())
            )
            .filter((metric) =>
              filters.length === 0 ||
              filters.some((filter) =>
                metric.toLowerCase().includes(filter)
              )
            )
            .sort((a, b) => {
              const aHasData = testResults.some(r => r[a] !== undefined && r[a] !== null);
              const bHasData = testResults.some(r => r[b] !== undefined && r[b] !== null);

              // Sort: metrics with data first
              if (aHasData && !bHasData) return -1;
              if (!aHasData && bHasData) return 1;
              return 0; // keep original order if both same
            })
            .map((metric) => {
              const testResultVal =
                Number(
                  testResults.find((r) => r[metric] !== undefined && r[metric] !== null)?.[metric]
                ) || 0;

              const normRanges = Object.fromEntries(
                getForm.map((item) => [
                  item.name,
                  {
                    min: item.min ?? (testResultVal - 50),
                    max: item.max ?? (testResultVal + 50),
                  },
                ])
              )

              const data = {
                labels,
                datasets: [
                  {
                    label: metric,
                    data: testResults.map((r) => r[metric]),
                    borderColor: datasetColors[metric],
                    backgroundColor: datasetColors[metric],
                    spanGaps: true 
                  },
                ],
              };

              const range = normRanges[metric];
              const yMin = range.min - (range.max-range.min)*0.3; 
              const yMax = range.max + (range.max-range.min)*0.3; 
              //range of min max val from blood test acceptance
              
              const options = {
                maintainAspectRatio: false,
                rangeFill: {
                  min: range.min,
                  max: range.max,
                  color: 'rgba(0, 200, 0, 0.15)', // light green background
                },
                plugins: {
                  datalabels: {
                  color: "black",   
                  anchor: "end",
                  align: "top",
                  font: {
                    weight: "bold",
                  },},
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
                  <div key={metric} className="chart-wrapper ">
                    <Line data={data} options={options} />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      </div>
    }
     
    </div>
  );
};

export default Chart;