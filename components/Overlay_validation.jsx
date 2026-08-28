"use client"

import '../style.css';

import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';

export default function PetNameInput({ continueAction, headline, message, ctaPositive, ctaNegative}) {

    return(

        <div className='validation_wrapper'>
            <div className='validation_headline'><h1>{headline}</h1> <CloseIcon /></div>
            
            <div className='validation_btn' >
                <Button 
                    className=""
                    onClick={() => {
                        continueAction()
                        setOverlayValidation(false)
                    }}
                    variant="contained"
                    sx={{ color: '#fff' }} >
                    Yes <DoneIcon />
                </Button>
                <Button 
                    className=""
                    onClick={() => setOverlayValidation(false)}
                    variant="contained"
                    sx={{ color: '#fff' }} 
                    >
                    {ctaNegative} 
                </Button>
            </div>
            
        </div>
    )
}