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

  
//extract data from file 
const extractTextFromImage = async (file) => {
  const { data: { text } } = await Tesseract.recognize(file, 'eng', {
    logger: m => console.log(m)
  })
  return text
}





export default function UploadExtractSave() {
  
  const {loading} = useLoadingContext();
  const {handleExtractAndSave, extractedText} = useBloodTestContext();
  const [file, setFile] = useState(null)
  const user = useUser();
  

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

// Upload file using standard upload
  const uploadDocToDB = async(file, userId) => {
    //upload file to supabase storage
      const { data, error } = await supabase
        .storage
        .from('documents')
        .upload(`${userId}/${file.name}`, file)
    
      if (error) {
        console.error('File upload error:', error)
        return null
      }
      
      const { publicURL } = supabase
        .storage
        .from('documents')
        .getPublicUrl(`${userId}/${file.name}`)
    
      return publicURL
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
        {loading ? 'Processing...' : 'Extract & Save'}
        </Button>
      <pre>{extractedText}</pre>


    </div>
  )
}



