"use client"
import GradeIcon from '@mui/icons-material/Grade';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DownloadIcon from '@mui/icons-material/Download';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './style.css';

import { useBloodTestContext } from '../context/BloodTestContext';

export default function Documents() {
    function formatDate(isoString) {
      return new Date(isoString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      });
    }

    const toggleDocs = () => {
      document.querySelector(".doc-wrapper").classList.toggle("hide")
      document.querySelector(".toggleVisibility").classList.toggle("upside")
    }
    
    const {handleClickPreviewImg_fromDocs, getDocImg, delDocs} = useBloodTestContext();
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
      <div className='doc-more-options'><MoreVertIcon className='doc-more-menu' />
        <div className='doc-more-hover'>
          <div><GradeIcon /> Add to Favorites 
            <span className='doc-more-tooltip'>Feature soon available</span>
          </div>
          <hr></hr>
          <div><DownloadIcon /> Download
            <span className='doc-more-tooltip'>Feature soon available</span>
          </div>
          <div><EditIcon className='doc-more-tiny' /> Rename
            <span className='doc-more-tooltip'>Feature soon available</span></div>
          <div className='doc-more-red' onClick={() => delDocs(url.file_url.toString(), url.id)}><DeleteOutlineIcon /> Delete</div>
          <hr></hr>
          <div className='doc-more-grid'>Created at <span>{formatDate(url.created_at)}</span></div>
        </div>
      </div>
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
