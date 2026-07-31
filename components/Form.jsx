"use client"

import { supabase } from '../app/lib/supabaseClient'
import { useFormStore } from "../app/stores/useFormStore";
import { useState } from 'react';
import useUser from '../app/lib/useUser'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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

import dayjs from 'dayjs';

import { useLoadingContext} from '../context/LoadingContext';
import './style.css';

import PetNameInput from './fields/PetNameInput'

import { useBloodTestContext } from "../context/BloodTestContext";

export default function Form() {
  const { file, chosenPetName , resetFileComp, 
    getDocsImg, resetForm, checkUsersLimit, 
    getNames, resetInputForm, fetchInitialFormTemplate,
  handleNewIniForm} = useBloodTestContext();

  const {loading, setNotification_warn_message,
      setNotification_warn_color,
      setNotification_warn, setLoading, setExtra_message,
      setExtra_message_action
       } = useLoadingContext();
  const user = useUser();
  const [valueDate, setValueDate] = useState(dayjs(new Date().toISOString().split("T")[0]))
  const [openAddValue, setOpenAddValue] = useState(false);
  const [deleteOffering, setDeleteOffering] = useState(false)
  

  let iniNewInput = {
    name: "",
    keyword: "",
    datum:new Date().toISOString().split("T")[0],
    min:null,
    max:null,
    unit:"",
    value:""
  }

  const { 
    getForm, 
    setForm, 
    valueToRemoveInBetween, 
    setValueToRemoveInBetween,
    testType,
    selectedType,
    setSelectedType
   } = useFormStore()
  
  const [newInput, setNewInput] = useState(iniNewInput);

  const addValueToForm = (name, newValue) => {
    const numericValue = newValue === "" ? "" : parseFloat(newValue);
    setForm((prev) =>
      prev.map((field) =>
        field.name === name
          ? { ...field, value: numericValue }
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
      // auto useeffect in bloodtestcontext
      // await resetNewList(newForm); //update db with removed val in possible values
    }
  };


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
      if(countSavedOnes > 4) {
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
                value: ""
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
      setOpenAddValue(false)
      const alreadyExists = getForm.some(item => item.name === newInput.name);

      if (alreadyExists) {
        console.log("Name already exists");
        
        setNotification_warn(true)
        setNotification_warn_message("Name already exists for this pet. Please choose another.")
        setNotification_warn_color("warning")
      } else {
        setForm(prev => [
          ...prev,
          { ...newInput }
        ]);
      };

      // setForm(prev => [
      //   ...prev,
      //   { ...newInput }
      // ]);
      setNewInput(iniNewInput)
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
              <MoreVertIcon
                className='more-options'
              />
              <span className='more-options-button'>
                <Button 
                  disabled={getForm.length === 0}
                  variant="contained"
                  sx={{ color: '#fff' }} 
                  onClick={(e) => {
                    e.preventDefault();
                    setForm([])
                  }}
                >Remove all</Button>
                <Button 
                  variant="contained"
                  sx={{ color: '#fff' }}
                  onClick={(e) => {
                    e.preventDefault();
                    if(!selectedType){
                        setNotification_warn(true)
                        setNotification_warn_message("Choose test type in step 2.")
                        setNotification_warn_color("warning")
                      return
                    }
                    fetchInitialFormTemplate()
                  }} 
                >Use Template Form</Button>
              </span>
            </span>
        <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
            className='box'
        >   
            { getForm.length == 0 &&
              
              <Button 
                variant="contained"
                sx={{ color: '#fff' }}
                onClick={(e) => {
                e.preventDefault();
                if(!selectedType){
                    setNotification_warn(true)
                    setNotification_warn_message("Choose test type in step 2.")
                    setNotification_warn_color("warning")
                  return
                }
                fetchInitialFormTemplate()
              }}
              >use template form</Button>

            }
            {getForm && getForm.map((f) => (
              <>
                {!deleteOffering && 
                  <TextField
                      className='form__fillable'
                      key={f.name+"_uni"}
                      label={f.name}
                      type="number"
                      slotProps={{
                        input: {
                          step: "0.01", // allow decimals
                        },
                      }}
                      value={f.value}
                      onChange={(e) => addValueToForm(f.name, e.target.value)}
                      variant="outlined"
                      focused={f.value == ""}
                  />
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
            </>
            ))}
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
                  <div className='form__add-input-overlay'>
                    <h3>New input informations for <span className="form__add-input-overlay-petname">{chosenPetName}</span></h3>
                    <TextField
                      label="Name"
                      value={newInput.name}
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
                      label="Keyword, that can be recognized from the image"
                      value={newInput.keyword}
                      onChange={(e) =>
                        setNewInput({
                          ...newInput,
                          keyword: [e.target.value],
                        })
                      }
                      variant="outlined"
                    />
                    <TextField
                      select
                      label="Test type inserted from step 2"
                      value={selectedType ?? newInput.material}
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
                      value={newInput.unit}
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
                      value={newInput.value}
                      onChange={(e) =>
                        setNewInput({
                          ...newInput,
                          value: e.target.value,
                        })
                      }
                      variant="outlined"
                    />
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
   