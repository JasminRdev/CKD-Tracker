"use client"
import { createContext, useContext, useEffect, useState } from 'react';

import { supabase } from '../app/lib/supabaseClient'
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
  Button,
  Box, 
  Typography,
  IconButton
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Divider from "@mui/material/Divider";
import RemoveIcon from '@mui/icons-material/Remove';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';

import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css'; 

import MoreVertIcon from '@mui/icons-material/MoreVert';
import './style.css';

import { useLoadingContext} from '../context/LoadingContext';
import { useBloodTestContext } from '../context/BloodTestContext';

import { useFormStore } from "../app/stores/useFormStore";


export default function Documents() {
  
  const { loading, setNotification_warn_message,
    setNotification_warn_color,
    setNotification_warn, setLoading, setExtra_message,
    setExtra_message_action
  } = useLoadingContext();

  const { 
    getForm, 
    testType,
    iniNewUnitForm
  } = useFormStore()

  const {
    handleClickPreviewImg_fromDocs, 
    getDocImg, 
    delDocs, 
    savedPetNames
  } = useBloodTestContext();
  
  const [ scale, setScale ] = useState(140);
  const [ searchDocPet, setSearchDocPet ] = useState("")
  const [ selectedType_docs, setSelectedType_docs ] = useState("")
  const [ docSort, setDocSort ] = useState("lastAdded");
  const [ showEditTestResult, setShowEditTestResult ] = useState(false);
  const [ searchFormInput, setSearchFormInput ] = useState("");
  const [ chosenFileName, setChosenFileName ] = useState("");
  const [ chosenFile, setChosenFile ] = useState("");
  // const [unitInEditDoc, setUnitInEditDoc] = useState()
  const [ usersUnits, setUsersUnits ] = useState()
  const [ possiInEditDoc, setPossiInEditDoc ] = useState()
  const [ openAddUnit, setOpenAddUnit ] = useState(false)
  const [ newUnitForm, setNewUnitForm ] = useState(false)
  const [ testType_doc, setTestType_doc ] = useState(false)
  const [ petName_doc, setPetName_doc ] = useState(false)
  const [ askToUpdate, setAskToUpdate ] = useState(false)
  const [ askToDelete, setAskToDelete ] = useState(false)

  const [ delDocs_id, setDelDocs_id ] = useState()
  const [ delDocs_file, setDelDocs_file ] = useState()
  
  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 20, 500));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 20, 50));
  };

  const resetZoom = () => {
    setScale(140);
  };
  
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
  
  const [dateRangeRaw_docs, setDateRangeRaw_docs] = useState();
  const [dateFilter_docs, setDateFilter_docs] = useState({startDate: "1.2000", endDate: "12.2029"})
  
  // useEffect(() => {
  //   console.log("1 data filled from edit doc - possi", possiInEditDoc)
  //   console.log("2 data filled from edit doc - unit", usersUnits)
  // },[possiInEditDoc,usersUnits])


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
        return new Date(b.created_at) - new Date(a.created_at);
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

    const getDocData = async (fileUrl) => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const params = new URLSearchParams({
        fileUrl,
      });

      const res = await fetch(`/api/getSingleTestResult?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      return json.data;
    };


    async function addNewUnitToForm_doc() {
      let factor = Number(newUnitForm.calcForFactor)/1000;
      console.log("addUnitToDB post to another unit - api fetch ")
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      await fetch(`/api/postUnit?pet=${petName_doc}&testtype=${testType_doc}&name=${newUnitForm.name}&fromUnit=${newUnitForm.fromUnit}&settedUnit=${newUnitForm.settedUnit}&factor=${factor}&offset=0`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNewUnitForm(iniNewUnitForm)
      getUnitsAgain()
    }
    
    const addUnitToForm = (name, chosenUnit, usersValue) => {
      const unitData = usersUnits.find(
        (colDB) => colDB.name == name && colDB.fromUnit == chosenUnit
      );

      const normalizedValue = unitData
        ? Number((unitData.factor * Number(usersValue)).toFixed(4))
        : usersValue;

      setPossiInEditDoc((prev) =>
        prev.map((field) =>
          field.name === name
            ? {
                ...field,
                originalUnit: chosenUnit,
                normalizedValue: normalizedValue,
              }
            : field
        )
      );
    };

    const addValueToForm = (name, usersValue, chosenUnit) => {
      const unitDB = usersUnits.find(
        (colDB) => colDB.name == name && colDB.fromUnit == chosenUnit
      );

      const normalizedValue = unitDB
        ? Number((unitDB.factor * Number(usersValue)).toFixed(4))
        : usersValue;


      const getSettedUnit = usersUnits.find(
        (colDB) => colDB.name == name 
      );

      if(usersValue == ""){
        setPossiInEditDoc((prev) =>
          prev.map((field) =>
            field.name === name
              ? { 
                ...field, 
                  value: "",
                  normalizedValue: "",
                  originalUnit: ""
              }
              : field
          )
        )
        return;
      }

      const numericValue = usersValue === "" ? "" : parseFloat(usersValue);
      setPossiInEditDoc((prev) =>
        prev.map((field) =>
          field.name === name
            ? { 
              ...field, 
                value: numericValue,
                normalizedValue: normalizedValue,
                originalUnit: !unitDB ? getSettedUnit.settedUnit : chosenUnit
            }
            : field
        )
      )
    };

    const getUnitsAgain = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(`/api/getAllUsersUnits?pet=${petName_doc}&testtype=${testType_doc}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();

      setUsersUnits(json.data);
    };
    

    async function editTestresult(fileUrl, petName, testType, fileName) {
      setLoading(true)

      setChosenFile(fileUrl)      
      setPetName_doc(petName)    
      setTestType_doc(testType)   
      setChosenFileName(fileName)  

      const getData_possi = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        const res = await fetch(`/api/getInputValues?pet=${petName}&testtype=${testType}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json(); 
        console.log("getInputValues possi - docs edit api fetch", json.data)
        setPossiInEditDoc(json.data)
      };
      await getData_possi()    
      
      const getData_units = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        const res = await fetch(`/api/getAllUsersUnits?pet=${petName}&testtype=${testType}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        console.log("getData_units get - docs edit api fetch", json.data)

        setUsersUnits(json.data);
      };  
      await getData_units()

      //fill data in form
      const getData_testresult = async () => {
        const rawData = await getDocData(fileUrl);
        
        rawData[0].data.forEach(str => {
          const { name, value, originalUnit, unit, normalizedValue } = JSON.parse(str);

          setPossiInEditDoc((prev) => 
            prev.map((field) => 
              field.name === name
              ? {
                ...field,
                value: value,
                originalUnit: originalUnit || originalUnit == "" && unit,
                unit: unit,
                normalizedValue: normalizedValue
              }
              : field
            )
          )
        }) 
      }
      await getData_testresult()

      setShowEditTestResult(true)
      setLoading(false)
    }

    async function saveUpdateTestresult() {
      setLoading(true)

      try {
        const payload = {
          form: possiInEditDoc
        };

        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;


        const params = new URLSearchParams({
          chosenFile,
        });

        const res = await fetch(`/api/updateTestresult?${params.toString()}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        // If API sends 400/500, read the API error
        if (!res.ok) {
          throw new Error(data.error || `Update failed: ${res.status}`);
        }
        // Success
        setNotification_warn(true)
        setNotification_warn_message("Successfully changed.")
        setNotification_warn_color("success")

      } catch (err) {
        console.error("Update error:", err.message);
        setNotification_warn(true)
        setNotification_warn_message(err.message)
        setNotification_warn_color("warning")
      }
      
      setLoading(false)
    }

  return (
  <div className="docs comp-wrapper">
    {askToUpdate && 
        (   <>
              <div className='validation_black'>
              </div>   

              <div className='validation_wrapper'>
                  <div className='validation_headline'><h1>Confirm to save</h1> 
                    <CloseIcon className="validation_close" onClick={() => setAskToUpdate(false)} /></div>
                  <hr></hr>

                  <div className='validation_text'>Are you sure you want to save the changes?</div>
                  <hr></hr>

                  <div className='validation_btn' >
                      <Button 
                          className="cta_positive"
                          onClick={() => {
                            saveUpdateTestresult()
                            setAskToUpdate(false)
                            setShowEditTestResult(false)
                          }}
                          variant="contained"
                          sx={{ color: '#fff' }} >
                          Save 
                      </Button>
                      <Button 
                          className="cta_negative"
                          onClick={() => setAskToUpdate(false)}
                          variant="contained"
                          sx={{ color: '#fff' }} 
                          >
                          Cancel 
                      </Button>
                  </div>
              </div>
            </>   
        )
    }

    {askToDelete && 
        (   <>
              <div className='validation_black'>
              </div>   

              <div className='validation_wrapper del'>
                  <div className='validation_headline'><h1>Confirm to delete</h1> 
                    <CloseIcon className="validation_close" onClick={() => setAskToDelete(false)} /></div>
                  <hr></hr>

                  <div className='validation_text'>Are you sure you want to delete? This cannot be undone.</div>
                  <hr></hr>

                  <div className='validation_btn' >
                      <Button 
                          className="cta_negative"
                          onClick={() => {
                            delDocs(delDocs_file, delDocs_id)
                            setAskToDelete(false)
                          }}
                          variant="contained"
                          sx={{ color: '#fff' }} 
                          >
                          Delete 
                      </Button>
                      <Button 
                          className="cta_positive"
                          onClick={() => {
                            setAskToDelete(false)
                          }}
                          variant="contained"
                          sx={{ color: '#fff' }} >
                          Cancel 
                      </Button>
                  </div>
              </div>
            </>   
        )
    }
  


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

                <div 
                  onClick={() => {
                    editTestresult(url.file_url, url.pet, url.test_type, fileName)
                  }}
                > 
                  <EditIcon className='doc-more-tiny' /> Edit
                </div>

                <div className='doc-more-red' onClick={() => {
                  setAskToDelete(true) 
                  setDelDocs_file(url.file_url.toString())
                  setDelDocs_id(url.id)
                }}><DeleteOutlineIcon /> Delete</div>
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

    {showEditTestResult && (
      <>
        <div className="doc_edit_testresult">
          <h1>Edit test data: {chosenFileName}</h1>
          
          <div className="doc_edit_topper">
            <TextField 
              id="standard-basic" 
              label="Seach value" 
              value={searchFormInput}
              onChange={(e) => setSearchFormInput(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <div className="doc_edit_testresult-button ">
              <Button 
                className="form__add-btn save"
                onClick={() => {
                  setAskToUpdate(true)
                }}
                variant="contained"
                sx={{ color: '#fff' }} 
              >
                Save <DoneIcon />
              </Button>
              <Button 
                className="form__add-btn"
                onClick={() => setShowEditTestResult(false)}
                variant="contained"
                sx={{ color: '#fff' }} 
              >
                Cancel <CloseIcon />
              </Button>
            </div>
          </div>


          <div className="doc_edit_testresult-big">

            <div className="form__add-helper-img">
              <div className="form__add-helper-img-controls">
                <IconButton onClick={zoomOut} size="small">
                  <RemoveIcon />
                </IconButton>

                <IconButton onClick={resetZoom} size="small">
                  <RestartAltIcon />
                </IconButton>

                <IconButton onClick={zoomIn} size="small">
                  <AddIcon />
                </IconButton>
              </div>

              <div className="form__add-helper-img-container">
                <img
                  className="docFile doc_edit" 
                  src={chosenFile} 
                  alt="document image"
                  style={{
                    width: `${scale}%`,
                    maxWidth: 'none',
                  }}
                />
              </div>
            </div>

            <div className="doc_edit_testresult-input">
              {possiInEditDoc && possiInEditDoc
              .filter((findName) =>
                findName.name.toLowerCase().includes(searchFormInput.toLowerCase())
              )
              .map((f) => (
              <div key={f.name+"_wrap"}>
                  <div className='form_wrapper'> 
                    <Typography
                      className="form__labelcopy"
                      component="label"
                      sx={{
                        display: 'block',
                        mb: 0.5,
                        whiteSpace: 'normal',
                      }}
                    >
                      {f.name}
                    </Typography>
                    <div className="form__groupInput">                  
                      <TextField
                          className='form__fillable'
                          key={f.name+"_uni"}
                          type="number"
                          slotProps={{
                            input: {
                              step: "0.01", // allow decimals
                            },
                          }}
                          value={f.value}
                          onChange={(e) => addValueToForm(f.name, e.target.value, f.originalUnit)}
                          variant="outlined"
                          focused={f.value == ""}
                      />                      
                      
                      <TextField
                        className='form_unit_wrapper'
                        select
                        label="Unit"
                        value={f.originalUnit}
                        onChange={(e) => addUnitToForm(f.name, e.target.value, f.value)}
                        helperText={
                          <Box
                            className='form_unit-flex'
                            component="span"
                            display="inline-flex"
                            alignItems="center"
                            gap={0.5}
                          >
                            <span>
                              <span className="form-unit_helperText">
                                {f.normalizedValue}
                              </span>{" "}
                              {usersUnits.find((colDB) => colDB.name === f.name)?.settedUnit ?? ""}
                            </span>

                            <Tooltip title="Charts compare values using a single unit. Your value will be converted to the unit shown below when displayed in charts, so all data can be compared consistently. The original value and the unit you selected are still saved and are used for lookups.">
                              <InfoOutlinedIcon
                                fontSize="inherit"
                                sx={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </Box>
                        }
                        >

                        {usersUnits
                        .filter((colDB) => colDB.name === f.name)
                        .map((colDB) => (
                          <MenuItem key={colDB.fromUnit} value={colDB.fromUnit}>
                            {colDB.fromUnit}
                          </MenuItem>
                        ))}
                        <Divider />
                        <MenuItem value="form-unit_extendUnit"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenAddUnit(true);
                            setNewUnitForm(
                              {
                                name: f.name,
                                settedUnit:usersUnits.find((colDB) => colDB.name === f.name)?.settedUnit ?? "" ,
                              }
                            )
                          }}
                        >
                          ➕ unit
                        </MenuItem>
                      </TextField>
                    </div>

                  </div>
              </div>
              ))}
            </div>

          </div>
        





          {openAddUnit &&
            (<div className='form__add-input-overlay unit'>
              <h3>Add another unit to <span className="form__add-input-overlay-petname">{petName_doc}`s {newUnitForm.name}</span> in {testType_doc}</h3>
              <TextField
                label="New unit"
                value={newUnitForm.fromUnit ?? ""}
                onChange={(e) => 
                  setNewUnitForm({
                    ...newUnitForm,
                    fromUnit: e.target.value,
                  })
                }
                variant="outlined"
                required
              />
              <TextField
                label={`1000 ${newUnitForm.fromUnit ?? "new unit"} = how much ${newUnitForm.settedUnit}?`} 
                type="number"
                value={newUnitForm.calcForFactor ?? ""}
                onChange={(e) =>
                  setNewUnitForm({
                    ...newUnitForm,
                    calcForFactor: e.target.value,
                  })
                }
                variant="outlined"
                required
              />
              <div className='form__add-btn-wrapper'>
                <Button 
                  className="form__add-btn save"
                  onClick={() => {
                    if(!newUnitForm.fromUnit || !newUnitForm.calcForFactor){
                      setNotification_warn(true)
                      setNotification_warn_message("Please fill out required fields.")
                      setNotification_warn_color("warning")
                      return
                    } 
                    if(usersUnits.find((colDB) => colDB.fromUnit.toLowerCase() === newUnitForm.fromUnit.toLowerCase()) || 
                    usersUnits.find((colDB) => colDB.settedUnit.toLowerCase() === newUnitForm.fromUnit.toLowerCase())){
                      setNotification_warn(true)
                      setNotification_warn_message("Unit exists already")
                      setNotification_warn_color("warning")
                      return
                    }
                    addNewUnitToForm_doc()
                    setOpenAddUnit(false)
                  }}
                  variant="contained"
                  sx={{ color: '#fff' }} 
                >
                  Save <DoneIcon />
                </Button>
                <Button 
                  className="form__add-btn"
                  onClick={() => setOpenAddUnit(false)}
                  variant="contained"
                  sx={{ color: '#fff' }} 
                >
                  Cancel <CloseIcon />
                </Button>
              </div>
            </div>)
          }
        </div>

      </>
    )}
  
  </div>
)};
