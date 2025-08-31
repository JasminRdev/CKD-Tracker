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

import ScrollContainer from './ux/ScrollContainer'

export default function UploadExtractSave() {
  
  const {loading, showOverlay, setShowOverlay, setOverlayerElement} = useLoadingContext();
  const {handleExtractAndSave, extractedText ,file, setFile, resetForm} = useBloodTestContext();
  const user = useUser();
  const [selectedImage, setSelectedImage] = useState(null)
  

  const handleFileChange = (e) => {
    resetForm(); //if not choosen multi files ::TODO

    const file = e.target.files[0];
    setFile(file)
    if (file) {
      setSelectedImage(URL.createObjectURL(file)); // creates preview link
    }
  }
  
  function handleForm() {
    if (!file) return alert('Upload an image first!')
    if (!user) return alert('Please sign in first!')

    handleExtractAndSave(file)
  }

  function handleClickPreviewImg() {
    setShowOverlay(true)
    setOverlayerElement(<img 
                className='overlayerPreviewImg'
                src={selectedImage} 
                alt="previewBig" 
              />)
  }

  

  return (
    <div className="comp-wrapper">
      <h1>Bloodtest comp</h1>
      <div className='data-extract-container'>
        <input type="file" accept="image/*" onChange={handleFileChange} />     
          <Button onClick={handleForm} disabled={loading} variant="contained">
          {loading ? 'Processing...' : 'Extract & Insert'}
          </Button>
        <pre className="extractedElement">
          {selectedImage && (
            <>
              <ScrollContainer >
                {extractedText}
              </ScrollContainer>
              <img 
                onClick={handleClickPreviewImg}
                src={selectedImage} 
                alt="preview" 
              />
            </>
          )}
        </pre>
      </div>
      

    </div>
  )
}



