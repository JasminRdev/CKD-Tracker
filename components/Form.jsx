"use client"

import { useRef } from "react";

import { supabase } from '../app/lib/supabaseClient'
import { useFormStore } from "../app/stores/useFormStore";
import { useEffect, useState } from 'react';
import useUser from '../app/lib/useUser'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Filter2RoundedIcon from '@mui/icons-material/Filter2Rounded';
import Filter3RoundedIcon from '@mui/icons-material/Filter3Rounded';
import Filter4RoundedIcon from '@mui/icons-material/Filter4Rounded';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Divider from "@mui/material/Divider";
import { Typography } from '@mui/material';
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import RestartAltIcon from '@mui/icons-material/RestartAlt';



import dayjs from 'dayjs';

import { useLoadingContext} from '../context/LoadingContext';

import './style.css';

import PetNameInput from './fields/PetNameInput'

import { useBloodTestContext } from "../context/BloodTestContext";
import { normalize } from 'path';
import { useChartContext } from '@/context/ChartContext';

export default function Form({inView}) {

  const { file, chosenPetName , resetFileComp, 
    getDocsImg, resetForm, checkUsersLimit, extractedText,
    getNames, resetInputForm,
    selectedImage,
    handleNewIniForm, addUnitToDB, addNewUnitToForm, getUnits} 
  = useBloodTestContext();
  
  const { updatePossi} = useChartContext();

  const {loading, setNotification_warn_message,
      setNotification_warn_color,
      setNotification_warn, setLoading, setExtra_message,
      setExtra_message_action
       } = useLoadingContext();
  const user = useUser();
  const [valueDate, setValueDate] = useState(dayjs(new Date().toISOString().split("T")[0]))
  const [openAddValue, setOpenAddValue] = useState(false);
  const [deleteOffering, setDeleteOffering] = useState(false)
  const [openAddUnit, setOpenAddUnit] = useState(false)
  const [searchFormInput, setSearchFormInput] = useState("");
  const [scale, setScale] = useState(140);

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 20, 500));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 20, 50));
  };

  const resetZoom = () => {
    setScale(140);
  };
  
  const { 
    getForm, 
    setForm, 
    valueToRemoveInBetween, 
    setValueToRemoveInBetween,
    testType,
    selectedType,
    setSelectedType, setUsersUnits, usersUnits, chosenUnit, setChosenUnit,
    newInput, setNewInput, iniNewInput,newUnitForm, setNewUnitForm,
    selectedPrioLevel, prioLevels
   } = useFormStore()
  
  const addValueToForm = (name, usersValue, chosenUnit) => {
    console.log("usersV ", usersValue == "")
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
      setForm((prev) =>
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
    setForm((prev) =>
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

  

  
  const addUnitToForm = (name, chosenUnit, usersValue) => {
    const unitData = usersUnits.find(
      (colDB) => colDB.name == name && colDB.fromUnit == chosenUnit
    );

    const normalizedValue = unitData
      ? Number((unitData.factor * Number(usersValue)).toFixed(4))
      : usersValue;

    setForm((prev) =>
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

  
  const removeValueFromForm = async() => {
    if(valueToRemoveInBetween.length){
      const newForm = getForm.filter(
        (field) => !valueToRemoveInBetween.includes(field.name)
      );
      setForm(newForm);
      console.log("api fetch - update possi", newForm)
      updatePossi(newForm); //activly update possi db
    }
  };

  useEffect(() => {
    console.log("hit newUnitForm" ,newUnitForm)
    getUnits();
  },[newUnitForm])


  const [helperWidth, setHelperWidth] = useState(500);

  const startResize = (e, side) => {
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = helperWidth;

    const handleMove = (e) => {
      const diff = e.clientX - startX;

      if (side === "right") {
        setHelperWidth(
          Math.max(250, Math.min(1000, startWidth + diff))
        );
      } else {
        setHelperWidth(
          Math.max(250, Math.min(1000, startWidth - diff))
        );
      }
    };

    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };


  // useEffect(() => {
  //   console.log("extractedText img filed", extractedText, selectedImage)
  // },[extractedText, selectedImage])

  //upload file to supabase storage
  const uploadFile = async () => {
    let buildedPath = `${user.id}/${chosenPetName}/${file.name}`;
    const { data, error } = await supabase
      .storage
      .from('documents')
      .upload(buildedPath, file)

    if (error) {
      console.error('File upload error:', error)
      return null
    }

    const { data: publicData } = supabase
      .storage
      .from('documents')
      .getPublicUrl(buildedPath);

    console.log(publicData.publicUrl);
    return publicData.publicUrl
    
  }
   async function saveData() {
      if(!selectedType){
        setNotification_warn(true)
        setNotification_warn_message("Please choose a test type in step 2 first.")
        setNotification_warn_color("warning")
        return
      }
      setLoading(true)

    // change this logic 
      if (file == null){
        setNotification_warn(true)
        setNotification_warn_message("Please select an image to save your data.")
        setNotification_warn_color("warning");
        
        setLoading(false)   
        return;
      }
      
      if(chosenPetName == null){
        setNotification_warn(true)
        setNotification_warn_message("Please fill out -Pet name- to save your data.")
        setNotification_warn_color("warning")
        
        setLoading(false)   
        return;
      } 

      let allowSave;
      let countSavedOnes = await checkUsersLimit();
      if(countSavedOnes > 3) {
        console.log("------------over 4 - shpuld no saving happen ", countSavedOnes)
        allowSave = false;
        setLoading(false) 
        setNotification_warn(true)
        setNotification_warn_message("You have reached the limit of 4 uploads.")
        setNotification_warn_color("warning")
      } else {
        allowSave = true;
      };

      if(allowSave){
        console.log("------------ allow saving bc under limit 4: ", countSavedOnes)
        const tableRow = crypto.randomUUID();
            const { data, error } = await supabase
              .from('testResult_data')
              .insert([{ 
                  user_id: user.id, 
                  id:tableRow,
                  data: getForm,
                  test_date: valueDate, 
                  created_at : new Date(), 
                  test_type :selectedType, 
                  pet: chosenPetName, 
                  file_url : await uploadFile()}]) 
            if (error) {
              console.error(error)
              
              setNotification_warn(true)
              setNotification_warn_message("Error - File name already exists with that pet")
              setNotification_warn_color("warning")
            } else {
              console.log('Data saved:', data)
              let cleanedForm = getForm.map(field => ({
                ...field,
                value: "",
                normalizedValue: "",
                originalUnit: ""
              }));
              //send new form to possible vals - happens auto with getForm update in bloodcontext
              await handleNewIniForm(cleanedForm); //resetNewList wars davor - refactored
              
              setNotification_warn(true)
              setNotification_warn_message("Successfull uploaded data - now included in the Chart")
              setNotification_warn_color("success")

              setExtra_message(true)
              setExtra_message_action("visit-chart")
              
              await getNames()
              await getDocsImg()
              resetForm();
              resetFileComp();
            
            }
            setLoading(false)  

      resetInputForm()             
      }   
      
    }

    function handleNotification(){
      setNotification_warn(true)
      
      setNotification_warn_message("Please log in.")
      setNotification_warn_color("warning")
    }

    function addNewInputToForm() {
      const alreadyExists = getForm.some(item => item.name === newInput.name);

      if (alreadyExists) {
        console.log("Name already exists");
        
        setNotification_warn(true)
        setNotification_warn_message("Name already exists for this pet. Please choose another.")
        setNotification_warn_color("warning")
      } else {
        setForm(prev => {
          const updatedForm = [
            ...prev,
            { ...newInput }
          ];

          console.log("api fetch - update possi", updatedForm);
            
          updatePossi(updatedForm); //activly update possi db

          console.log(("api fetch - add new unit"))

          return updatedForm;
        });

        addUnitToDB()
        setOpenAddValue(false)
        setNewInput(iniNewInput)
      };

      // setForm(prev => [
      //   ...prev,
      //   { ...newInput }
      // ]);
      // setNewInput(iniNewInput)
      // setForm(prev => [
      //   ...prev,
      //   {
      //     name: "testNew",
      //     value: "999999",
      //     keyword: ["KreaTest"],
      //     probe: "Labor",
      //     material: "Urin",
      //     datum: "2022-05-14"
      // +min max
      //   }
      // ])
      // console.log("updated ini ", getForm, openAddValue)
    }


    
  return (
    <div className="comp-wrapper form-wrapper">
        <h2 ><Filter2RoundedIcon />Basic informations</h2>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                      format="DD/MM/YYYY"
                      label="Select date of test result"
                      value={valueDate}
                      onChange={(newValue) => setValueDate(newValue)}
                      renderInput={(params) => <TextField {...params} />}
                  />
              </LocalizationProvider>
           
              
              <TextField
                className='input-wide'
                select
                label="Test type"
                value={selectedType}
                onChange={(e) => {
                    setSelectedType(e.target.value);
                }}
                // helperText="Please select your test type"
                >
                {testType.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                    {option.label}
                    </MenuItem>
                ))}
              </TextField>
               <PetNameInput requiredByForm="true" />


            <span className='with-more-options'>
              <h2><Filter3RoundedIcon />Add/Edit Values </h2>  
            </span>
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
        <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
            className={`box ${inView ? "inView" : "outView"}`}
        >   
           
            {getForm && getForm
              .filter((findName) =>
                findName.name.toLowerCase().includes(searchFormInput.toLowerCase())
              )
              .map((f) => (
              <div key={f.name+"_wrap"}>
                {!deleteOffering && 
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
                }              


                {deleteOffering && 
                  <div   
                    className={`form__delete-btn ${
                    valueToRemoveInBetween.includes(f.name) ? "selected" : ""
                    }`}
                    onClick={() => {
                      setValueToRemoveInBetween((prev) =>
                        prev.includes(f.name)
                          ? prev.filter((name) => name !== f.name) // deseltec it
                          : [...prev, f.name] // select it
                      );
                    }}>
                  Remove {f.name} <RemoveCircleIcon />
                  </div>
                }
            </div>
            ))}
            
                {openAddUnit &&
                  (<div className='form__add-input-overlay unit'>
                    <h3>Add another unit to <span className="form__add-input-overlay-petname">{chosenPetName}`s {newUnitForm.name}</span> in {selectedType}</h3>
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
                          addNewUnitToForm()
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

            {(selectedImage || extractedText) &&

              <div
                className="main-helper-container"
                style={{ width: `${helperWidth}px` }}
              >
                {/* IMAGE */}
                {selectedImage && (
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
                        src={selectedImage}
                        alt="preview"
                        style={{
                          width: `${scale}%`,
                          maxWidth: 'none',
                        }}
                      />
                    </div>

                  </div>
                )}

                {/* TEXT */}
                {extractedText && (
                  <div className="main-helper-text">
                    {extractedText.split("\n").map((line, index) => (
                      <div key={index}>
                        {line}
                      </div>
                    ))}
                  </div>
                )}

                {/* RIGHT RESIZE HANDLE */}
                <div
                  className="resize-handle resize-right"
                  onPointerDown={(e) => startResize(e, "right")}
                />

              </div>
            }

              <div className="form__add-wrapper">
                <Button 
                  className="button-save-db form__add-input form__value-input"
                  onClick={() => {
                    if(!selectedType){
                      setNotification_warn(true)
                      setNotification_warn_message("Please choose a test type in step 2 first.")
                      setNotification_warn_color("warning")
                      return
                    }
                    setOpenAddValue(true)
                  }}
                  variant="contained"
                  sx={{ color: '#fff' }} 
                >
                  Add Value <AddIcon />
                </Button>
                
                <Button 
                  className="button-save-db form__del-input form__value-input"
                  onClick={() =>  {
                    setDeleteOffering((prev) => !prev)
                    removeValueFromForm();
                  }}
                  variant="contained"
                  sx={{ color: '#fff' }} 
                >
                  {deleteOffering ? "Confirm Delete" : "Remove Value"} <DeleteIcon />
                </Button>

               {openAddValue && (

                  <div className='form__add-container'>
                    <span class="form__add-close">
                      <CloseIcon 
                        onClick={() => setOpenAddValue(false)} 
                      />
                    </span>
                    {selectedImage && (
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
                            src={selectedImage}
                            alt="preview"
                            style={{
                              width: `${scale}%`,
                              maxWidth: 'none',
                            }}
                          />
                        </div>

                      </div>
                    )
                    }

                    {extractedText && (
                      <div className='form__add-helper-text'>
                        {extractedText.split('\n').map((line, index) => (
                          <div key={index}>
                            {line}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className='form__add-input-overlay'>
                      <h3>New input informations for <span className="form__add-input-overlay-petname">{chosenPetName}</span></h3>
                      <TextField
                        label="Name"
                        value={newInput.name ?? ""}
                        onChange={(e) => 
                          setNewInput({
                            ...newInput,
                            name: e.target.value,
                          })
                        }
                        variant="outlined"
                        required
                      />
                      <TextField
                        fullWidth
                        label="Description"
                        placeholder="Enter description..."
                        multiline
                        minRows={1}
                        value={newInput.description ?? ""}
                        onChange={(e) => 
                          setNewInput({
                            ...newInput,
                            description: e.target.value,
                          })
                        }
                      />
                      <TextField
                        label="Keyword, that can be recognized from the image, f.e. Calcium,Talcium,Talci"
                        value={newInput.keyword ?? ""}
                        onChange={(e) =>
                          setNewInput({
                            ...newInput,
                            keyword: e.target.value.split(","),
                          })
                        }
                        variant="outlined"
                      />
                      <TextField
                        label="Keyword, that need to be excluded (Calcium -> Calcium ionisiert)"
                        value={newInput.exclude ?? ""}
                        onChange={(e) =>
                          setNewInput({
                            ...newInput,
                            exclude: e.target.value.split(","),
                          })
                        }
                        variant="outlined"
                      />
                      <TextField
                        select
                        label="Test type inserted from step 2"
                        value={selectedType ?? (newInput.material ?? "")}
                        onChange={(e) =>
                          setNewInput({
                            ...newInput,
                            material: e.target.value,
                          })
                        }
                        variant="outlined"
                        disabled
                        required
                        >
                        {testType.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                            {option.label}
                            </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        label="Today's date"
                        value={new Date().toISOString().split("T")[0]}
                        variant="outlined"
                        required
                        disabled
                      />
                      <TextField
                        label="Min toleranz"
                        type="number"
                        value={newInput.min ?? ""}
                        onChange={(e) =>
                          setNewInput({
                            ...newInput,
                            min: e.target.value === "" ? null : Number(e.target.value),
                          })
                        }
                        variant="outlined"
                      />
                      <TextField
                        label="Max toleranz"
                        type="number"
                        value={newInput.max ?? ""}
                        onChange={(e) =>
                          setNewInput({
                            ...newInput,
                            max: e.target.value === "" ? null : Number(e.target.value),
                          })
                        }
                        variant="outlined"
                      />
                      <TextField
                        label="Unit (mg/dL.. etc)"
                        value={newInput.unit ?? ""}
                        onChange={(e) =>
                          setNewInput({
                            ...newInput,
                            unit: e.target.value,
                          })
                        }
                        variant="outlined"
                        required
                      />
                      <TextField
                        label="Value"
                        value={newInput.value ?? ""}
                        onChange={(e) =>
                          setNewInput({
                            ...newInput,
                            value: e.target.value,
                          })
                        }
                        variant="outlined"
                      />
                      <TextField
                        select
                        label="Priority level"
                        value={newInput.prioLevel ?? ""}
                        onChange={(e) =>
                          setNewInput({
                            ...newInput,
                            prioLevel: e.target.value,
                          })
                        }
                        variant="outlined"
                        >
                        {prioLevels.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                            {option.label}
                            </MenuItem>
                        ))}
                      </TextField>
                      <div className='form__add-btn-wrapper'>
                      <Button 
                          className="form__add-btn save"
                          onClick={() => {
                            if(!newInput.name || !newInput.unit){
                              console.log("", newInput.unit, newInput.name)
                              setNotification_warn(true)
                              setNotification_warn_message("Please fill out required fields.")
                              setNotification_warn_color("warning")
                              return
                            }
                            addNewInputToForm()
                          }}
                          variant="contained"
                          sx={{ color: '#fff' }} 
                        >
                          Save <DoneIcon />
                        </Button>
                        <Button 
                          className="form__add-btn"
                          onClick={() => setOpenAddValue(false)}
                          variant="contained"
                          sx={{ color: '#fff' }} 
                        >
                          Cancel <CloseIcon />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              

            <h2><Filter4RoundedIcon />Saving</h2>
            <div className='full-width'>
              {
                user  
                ? (
                  <Button 
                    className="button-save-db" 
                    onClick={saveData} 
                    disabled={loading} 
                    variant="contained">
                  Save data</Button>
                  )
                :
                  (
                 <Button 
                  className="button-save-db"
                  onClick={() => handleNotification()}
                  variant="contained"
                  sx={{ backgroundColor: '#bdbdbd', color: '#fff' }} 
                >
                  Save data
                </Button>
                )
              }
            </div>
        </Box>
      </div>
  );
}
   