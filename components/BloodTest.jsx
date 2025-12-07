//blood test

import Button from '@mui/material/Button';

import useUser from '../app/lib/useUser'

import Filter1RoundedIcon from '@mui/icons-material/Filter1Rounded';

import './style.css';


//context
import { useBloodTestContext } from '../context/BloodTestContext';
import { useLoadingContext } from '../context/LoadingContext';

import ScrollContainer from './ux/ScrollContainer'

export default function UploadExtractSave() {
  
  const {loading, showOverlay, setShowOverlay, setOverlayerElement} = useLoadingContext();
  const {handleClickPreviewImg_forExtraction, handleExtractAndSave, extractedText ,file, selectedImage, handleFileChange} = useBloodTestContext();
  const user = useUser();


  function handleForm() {
    if (!file) return alert('Upload an image first!')
    if (!user) return alert('Please sign in first!')

    handleExtractAndSave(file)
  }


  return (
    <div className="comp-wrapper">
      <h2><Filter1RoundedIcon />Upload file</h2>
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
                onClick={handleClickPreviewImg_forExtraction}
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



