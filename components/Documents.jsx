"use client"
import { createContext, useContext, useEffect, useState } from 'react';

import GradeIcon from '@mui/icons-material/Grade';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DownloadIcon from '@mui/icons-material/Download';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css'; 

import MoreVertIcon from '@mui/icons-material/MoreVert';
import './style.css';

import { useBloodTestContext } from '../context/BloodTestContext';

import { useFormStore } from "../app/stores/useFormStore";

export default function Documents() {
  const { 
    testType
    } = useFormStore()

  const [searchDocPet, setSearchDocPet] = useState("")
  const [selectedType_docs, setSelectedType_docs] = useState("")
  const [docSort, setDocSort] = useState("lastAdded");

  function formatDate(isoString) {
    return new Date(isoString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  }

  const toggleDocs = () => {
    document.querySelector(".doc-wrapper").classList.toggle("hide")
    document.querySelector(".toggleVisibility").classList.toggle("upside")
  }
  
  const {handleClickPreviewImg_fromDocs, getDocImg, delDocs, savedPetNames} = useBloodTestContext();

  
  const [dateRangeRaw_docs, setDateRangeRaw_docs] = useState();
  const [dateFilter_docs, setDateFilter_docs] = useState({startDate: "1.2000", endDate: "12.2029"})
  
  
  const formatMonthYear = (date) => {
    if (!date ) return "";
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${month}.${year}`;
  };


  const handleDateRangePicker_docs = (range) => {
    if(!range){
      setDateRangeRaw_docs([])
      setDateFilter_docs({})
      return
    }
    setDateRangeRaw_docs(range);
    setDateFilter_docs({
      startDate: formatMonthYear(range[0]),
      endDate: formatMonthYear(range[1]),
    });
  };

  
  useEffect(() => {
    setDateRangeRaw_docs([
    new Date(2000, 1, 1), 
    new Date(2029, 11, 20)
  ])
  }, [])
  
  function isTestDateInRange(testDate, startDate, endDate) {
    if (!testDate || !startDate || !endDate) return true;

    const [startMonth, startYear] = startDate.split(".");
    const [endMonth, endYear] = endDate.split(".");

    const [testYear, testMonth] = testDate.split("-");

    const start =
      Number(startYear) * 12 + Number(startMonth);

    const end =
      Number(endYear) * 12 + Number(endMonth);

    const test =
      Number(testYear) * 12 + Number(testMonth);

    return test >= start && test <= end;
  }

  const filteredDocs = getDocImg && (getDocImg?.filter((url) =>
      (!searchDocPet ||
        url.pet?.toLowerCase().includes(searchDocPet.toLowerCase())) &&

      isTestDateInRange(
        url.test_date,
        dateFilter_docs.startDate,
        dateFilter_docs.endDate
      ) &&

      (!selectedType_docs ||
        url.test_type === selectedType_docs)
    ) ?? []);

    const sortedDocs = [...filteredDocs].sort((a, b) => {
      if (docSort === "lastAdded") {
        return 0;
      }

      if (docSort === "date") {
        return new Date(b.test_date) - new Date(a.test_date);
      }

      if (docSort === "name") {
        const nameA = a.file_url?.split("/").pop() || "";
        const nameB = b.file_url?.split("/").pop() || "";

        return nameA.localeCompare(nameB, undefined, {
          sensitivity: "base",
        });
      }

      return 0;
    });


  return (
  <div className="docs comp-wrapper">
    <h2 className='wrap'>
      Uploaded files ({sortedDocs.length})
      <span className="toggleVisibility" onClick={toggleDocs}><KeyboardArrowUpIcon /></span>
    </h2>
    <div className="docs-filter">
      <div>
        <Autocomplete
          className="input-wide"
          freeSolo
          options={savedPetNames.map((opt) => opt.value)}
          value={searchDocPet || ""}
          onChange={(event, newValue) => {
            setSearchDocPet(newValue || "");
          }}
          onInputChange={(event, newInputValue) => {
            setSearchDocPet(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Pet"
              className="input-wide"
            />
          )}
        />
      </div>

      <DateRangePicker
        className="docs-date"
        onChange={handleDateRangePicker_docs}
        value={dateRangeRaw_docs}
      />
      
      <TextField
        className='input-wide'
        select
        label="Test type"
        value={selectedType_docs}
        onChange={(e) => {
            setSelectedType_docs(e.target.value);
        }}
        // helperText="Please select your test type"
        >
        <MenuItem value="">
          All test types
        </MenuItem>
        {testType.map((option) => (
            <MenuItem key={option.value} value={option.value}>
            {option.label}
            </MenuItem>
        ))}
      </TextField>

      <FormControl className='doc-sort' >
        <InputLabel id="doc-sort-label">Sort by</InputLabel>
        <Select
          labelId="doc-sort-label"
          value={docSort}
          label="Sort by"
          onChange={(e) => setDocSort(e.target.value)}
        >
          <MenuItem value="lastAdded">
            Last added
          </MenuItem>

          <MenuItem value="date">
            Date
          </MenuItem>

          <MenuItem value="name">
            Name A–Z
          </MenuItem>
        </Select>
      </FormControl>

    </div>

    <div className='doc-wrapper'>
    {!getDocImg?.length && <p>Loading...</p>}

      {sortedDocs && sortedDocs.map((url, i) => {
        const fileName = url.file_url.split('/').pop();
        const truncatedFileName = fileName.slice(0,17) + "...";
        //later filter also test type blood out
        return (
          <div key={i} className="doc-container">
            <div className='doc-more-options'><MoreVertIcon className='doc-more-menu' />
              <div className='doc-more-hover'>
                <div><GradeIcon /> Add to Favorites 
                  <span className='doc-more-tooltip'>Feature soon available</span>
                </div>
                <hr></hr>
                <div><DownloadIcon /> Download
                  <span className='doc-more-tooltip'>Feature soon available</span>
                </div>
                <div><EditIcon className='doc-more-tiny' /> Rename
                  <span className='doc-more-tooltip'>Feature soon available</span></div>
                <div className='doc-more-red' onClick={() => delDocs(url.file_url.toString(), url.id)}><DeleteOutlineIcon /> Delete</div>
                <hr></hr>
                <div className='doc-more-grid'>Created at <span>{formatDate(url.created_at)}</span></div>
              </div>
            </div>
            <div className="doc-name">
              {url.user_id == "admin" && <span className='doc-owner'>example data</span>}
              {url.pet}
            </div>
            <div  className="doc-name">{truncatedFileName}
              <span className='doc-hover-tip'>{fileName}</span>
            </div>
            <div
              className="doc-item"
              onClick={() => handleClickPreviewImg_fromDocs(url.file_url)}
            >
              <img className="docFile" src={url.file_url} alt={fileName} />
              <div className="doc-item-overlay">
                <div className="docs-expand-img">
                  <OpenInFullIcon fontSize="large" />
                </div>
              </div>
            </div>
          </div>
        );
      })}

              

    </div>
  </div>
)};
