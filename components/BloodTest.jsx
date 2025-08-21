//blood test


//example flow react comp - Upload image → extract text → parse data → save to DB
import { useState } from 'react'
import { supabase } from '../app/lib/supabaseClient'

import Button from '@mui/material/Button';

import Tesseract from 'tesseract.js'
import useUser from '../app/lib/useUser'


import './style.css';


//context
import { useBloodTestContext } from '../context/BloodTestContext';
import { useLoadingContext } from '../context/LoadingContext';

export default function UploadExtractSave() {
  
  const {loading} = useLoadingContext();
  const {handleExtractAndSave, extractedText ,file, setFile, resetForm} = useBloodTestContext();
  const user = useUser();
  

  const handleFileChange = (e) => {
    resetForm(); //if not choosen multi files ::TODO
    setFile(e.target.files[0])
  }
  
  function handleForm() {
    if (!file) return alert('Upload an image first!')
    if (!user) return alert('Please sign in first!')

    handleExtractAndSave(file)
  }


  

  return (
    <div className="comp-wrapper">
      <h1>Bloodtest comp</h1>
      <input type="file" onChange={handleFileChange} />     
        <Button onClick={handleForm} disabled={loading} variant="contained">
        {loading ? 'Processing...' : 'Extract & Insert'}
        </Button>
      <pre>{extractedText}</pre>


    </div>
  )
}



