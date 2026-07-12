"use client"

import { supabase } from '../app/lib/supabaseClient'
import { useFormStore } from "../app/stores/useFormStore";
import { useState } from 'react';
import useUser from '../app/lib/useUser'
import * as React from 'react';
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

import dayjs from 'dayjs';

import { useLoadingContext} from '../context/LoadingContext';
import './style.css';

import PetNameInput from './fields/PetNameInput'

import { useBloodTestContext } from "../context/BloodTestContext";
import { useFormState } from 'react-dom';

export default function Form() {
  const { file, chosenPetName , resetFileComp
    ,resetNewList, getDocsImg, resetForm, checkUsersLimit, getNames,resetInputForm} = useBloodTestContext();
  const {loading, setNotification_warn_message,
      setNotification_warn_color,
      setNotification_warn, setLoading
       } = useLoadingContext();
  const user = useUser();
  const [valueDate, setValueDate] = useState(dayjs("2026-03-01"))
  const [selectedType, setSelectedType] = useState("Blood");
  const [openAddValue, setOpenAddValue] = useState(false);
  const testType = [
    {
      value: 'Blood',
      label: 'Blood',
    },
    // {
    //   value: 'Urine',
    //   label: 'Urine',
    // },
  ];

  let iniNewInput = {
    name: "",
    keyword: "",
    probe: "",
    material: "",
    datum:"",
    min:null,
    max:null,
    unit:"",
    value:""
  }

  const { getForm, setForm } = useFormStore()
  const [newInput, setNewInput] = useState(iniNewInput);

  const handleChange = (name, newValue) => {
    const numericValue = newValue === "" ? "" : parseFloat(newValue);
    setForm((prev) =>
      prev.map((field) =>
        field.name === name
          ? { ...field, value: numericValue }
          : field
      )
    );
    // setForm((prev) =>
    //   prev.map((field) =>
    //     field.name === name ? { ...field, value: numericValue } : field
    //   )
    // );
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
      setLoading(true)
    // change this logic 
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

              //send new form to possible vals
              await resetNewList();
              
              setNotification_warn(true)
              setNotification_warn_message("Successfull uploaded data - now included in the Chart")
              setNotification_warn_color("success")
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
      setForm(prev => [
        ...prev,
        { ...newInput }
      ]);
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
      console.log("updated ini ", getForm, openAddValue)
    }

  return (
    <div className="comp-wrapper form-wrapper">
        <h2 ><Filter2RoundedIcon />Basic informations</h2>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                      label="Select date of test result"
                      value={valueDate}
                      onChange={(newValue) => setValueDate(newValue)}
                      renderInput={(params) => <TextField {...params} />}
                  />
              </LocalizationProvider>
           
              
              <TextField
                className='input-wide'
                select
                label="Please select your test type"
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


            <h2><Filter3RoundedIcon />Add/Edit Values</h2>
        <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
            className='box'
        >
            {getForm && getForm.map((f) => (
                <TextField
                    key={f.name}
                    label={f.name}
                    type="number"
                    slotProps={{
                      input: {
                        step: "0.01", // allow decimals
                      },
                    }}
                    value={f.value}
                    onChange={(e) => handleChange(f.name, e.target.value)}
                    variant="outlined"
                    focused={f.value == ""}
                />
            ))}
              <div className="form__add-wrapper">
                <Button 
                  className="button-save-db form__add-input"
                  onClick={() => setOpenAddValue(true)}
                  variant="contained"
                  sx={{ color: '#fff' }} 
                >
                  Add Value <AddIcon />
                </Button>

               {openAddValue && (
                  <div className='form__add-input-overlay'>
                    <h3>New input informations</h3>
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
                          keyword: e.target.value,
                        })
                      }
                      variant="outlined"
                      required
                    />
                    <TextField
                      label="Probe, like lab or homekit"
                      value={newInput.probe}
                      onChange={(e) =>
                        setNewInput({
                          ...newInput,
                          probe: e.target.value,
                        })
                      }
                      variant="outlined"
                      required
                    />
                    <TextField
                      label="Material (Blood/Urine)"
                      value={newInput.material}
                      onChange={(e) =>
                        setNewInput({
                          ...newInput,
                          material: e.target.value,
                        })
                      }
                      variant="outlined"
                      required
                    />
                    <TextField
                      label="Today's date"
                      value={new Date().toLocaleDateString("en-GB").replace(/\//g, "-")}
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
                      label="Unit (mg/dl.. etc)"
                      value={newInput.unit}
                      onChange={(e) =>
                        setNewInput({
                          ...newInput,
                          unit: e.target.value,
                        })
                      }
                      variant="outlined"
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
                        onClick={() => addNewInputToForm()}
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
                        Close <CloseIcon />
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
   