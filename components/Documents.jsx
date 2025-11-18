"use client"


import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import './style.css';

import { useBloodTestContext } from '../context/BloodTestContext';

export default function Documents() {

    const toggleDocs = () => {
      document.querySelector(".doc-wrapper").classList.toggle("hide")
      document.querySelector(".toggleVisibility").classList.toggle("upside")
    }
    
    const {handleClickPreviewImg_fromDocs, getDocImg} = useBloodTestContext();
    let fileName = "file name cut"
    if (fileName.length > 10){
      fileName = fileName.substr(0, 10) + "...";
    }
   
    return (
    <div className="docs comp-wrapper">
      <h1>documents comp ({getDocImg && getDocImg.length}) <span className="toggleVisibility" onClick={toggleDocs}><KeyboardArrowUpIcon /></span>
      </h1>
       <div className='doc-wrapper'>
          {!getDocImg?.length && <p>Loading...</p>}

    {getDocImg && getDocImg.map((url, i) => {
    const fileName = url.file_url.split('/').pop().slice(0,17) + "...";
//later filter also test type blood out
  return (
    <div key={i} className="doc-container">
      <div className="doc-name">
        {url.user_id == "admin" && <span className='doc-owner'>example data</span>}
        {url.pet}
      </div>
      <div title={url.file_url.split('/').pop()} className="doc-name">{fileName}</div>
      <div
        className="doc-item"
        onClick={() => handleClickPreviewImg_fromDocs(url.file_url)}
      >
        <img className="docFile" src={url.file_url} alt={fileName} />
        <div className="doc-item-overlay">
          <div className="docs-expand-img">
            <OpenInFullIcon fontSize="large" />
          </div>
        </div>
      </div>
    </div>
  );
})}

             

            </div>
          </div>
    );
}
