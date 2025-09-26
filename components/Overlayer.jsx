"use client"

import './style.css';

import { useLoadingContext } from '../context/LoadingContext';


import CloseIcon from '@mui/icons-material/Close';

export default function Overlayer() {
    
    const {overlayerElement, setShowOverlay} = useLoadingContext();   

    function handleClosePreviewBig() {
        setShowOverlay(false)
    }
   {
    return (
        <>
            {overlayerElement &&
                <div>Overlayerobj
                    <div className='closePreviewBig'><CloseIcon onClick={handleClosePreviewBig} /></div>
                    {overlayerElement}

                </div>
            }
            
            <div className="comp-wrapper overlayer">
                <h1>Overlayer comp shadow</h1>
            </div>
        </>
    );
  };
}
