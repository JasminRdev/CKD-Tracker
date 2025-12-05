"use client"

import { supabase } from '../app/lib/supabaseClient'

import { useState } from 'react';
import useUser from '../app/lib/useUser'
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Filter1RoundedIcon from '@mui/icons-material/Filter1Rounded';
import Filter2RoundedIcon from '@mui/icons-material/Filter2Rounded';

import MenuItem from '@mui/material/MenuItem';

import dayjs from 'dayjs';

import { useLoadingContext} from '../context/LoadingContext';
import './style.css';

import PetNameInput from './fields/PetNameInput'

import { useBloodTestContext } from "../context/BloodTestContext";
import { useSupabaseContext } from '../context/SupabaseContext';
export default function Form() {
  const { form, setForm, file, chosenPetName , getDocsImg, resetForm, checkUsersLimit} = useBloodTestContext();
  const {loading, setNotification_warn_message,
      setNotification_warn_color,
      setNotification_warn, 
       } = useLoadingContext();
  const user = useUser();
  const [valueDate, setValueDate] = useState(dayjs("2025-08-11"))
  const [selectedType, setSelectedType] = useState("Blood");

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




  const handleChange = (name, newValue) => {
    const numericValue = newValue === "" ? "" : parseFloat(newValue);
    
    setForm((prev) =>
      prev.map((field) =>
        field.name === name ? { ...field, value: numericValue } : field
      )
    );
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
    // change this logic 
      let allowSave;
      let countSavedOnes = await checkUsersLimit(user.id);
      if(countSavedOnes > 4) {
        allowSave = false;
        setNotification_warn(true)
        setNotification_warn_message("You have reached the limit of 4 uploads.")
        setNotification_warn_color("warning")
      } else {
        allowSave = true;
      };

      if(allowSave){
        const tableRow = crypto.randomUUID();
            const { data, error } = await supabase
              .from('testResult_data')
              .insert([{ 
                  user_id: user.id, 
                  id:tableRow,
                  data: form,
                  test_date: valueDate, 
                  created_at : new Date(), 
                  test_type :selectedType, 
                  pet: chosenPetName, 
                  file_url : await uploadFile()}]) 
            if (error) console.error(error)
            else console.log('Data saved:', data)

            await getDocsImg()
            resetForm();
      }
      
    }


  return (
    <div className="comp-wrapper form-wrapper">
        <h2><Filter1RoundedIcon />Values</h2>
        <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
            className='box'
        >
            {form && form.map((f) => (
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
            <h2 className='top-line'><Filter2RoundedIcon />Other informations</h2>
            <div className='full-width'>
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
               <PetNameInput />
              {
                user  
                ? (
                  <Button className="button-save-db" onClick={saveData} disabled={loading} variant="contained">Save data</Button>
                  )
                :
                  (
                 <Button 
                  className="button-save-db"
                  onClick={() => setNotification_warn(true)}
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
   