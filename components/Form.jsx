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

import MenuItem from '@mui/material/MenuItem';

import dayjs from 'dayjs';

import { useLoadingContext } from '../context/LoadingContext';
import './style.css';

import PetNameInput from './fields/PetNameInput'

import { useBloodTestContext } from "../context/BloodTestContext";
import { useSupabaseContext } from '../context/SupabaseContext';
export default function Form() {
  const { form, setForm, file, chosenPetName , getDocsImg, resetForm, setBloodTestReset} = useBloodTestContext();
  const {loading, setLoading} = useLoadingContext();
  const user = useUser();
  const [valueDate, setValueDate] = useState(dayjs("2025-08-11"))
  const [selectedType, setSelectedType] = useState("Blood");
  const {getNextId} = useSupabaseContext();

  const testType = [
    {
      value: 'Blood',
      label: 'Blood',
    },
    {
      value: 'Urine',
      label: 'Urine',
    },
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
    const { data, error } = await supabase
      .storage
      .from('documents')
      .upload(`${user.id}/${file.name}`, file)

    if (error) {
      console.error('File upload error:', error)
      return null
    }

    const { data: publicData } = supabase
      .storage
      .from('documents')
      .getPublicUrl(`${user.id}/${file.name}`);

    console.log(publicData.publicUrl);
    return publicData.publicUrl
    
  }

   async function saveData() {
     const tableRow = await getNextId();
        console.log("data ", form)
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
                file_url : await uploadFile() }]) 
          if (error) console.error(error)
          else console.log('Data saved:', data)

          await getDocsImg()
          resetForm();
           setBloodTestReset(oldKey => oldKey + 1)
    }


  return (
    <div className="comp-wrapper form-wrapper">
        <h1>Data inputs</h1>
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
         
              <Button className="button-save-db" onClick={saveData} disabled={loading} variant="contained">Save data</Button>
            </div>
        </Box>
      </div>
  );
}
   