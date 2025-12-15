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
  const {handleClickPreviewImg_forExtraction, handleExtractAndSave,  fileKey, extractedText ,file, selectedImage, handleFileChange} = useBloodTestContext();
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
        <Button
          className='extract-button'
          variant="contained"
          component="label"
        >
          Choose File
          <input key={fileKey} type="file" accept="image/*" onChange={handleFileChange} hidden
          />
        </Button>
        {file ?  <><p className='extract-file-name'>Selected: {file.name}</p></> : ''}
        <Button onClick={handleForm} disabled={file ? loading : true} variant="contained">
          {loading ? 'Processing...' : 'Extract & Fill Inputs'}
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



