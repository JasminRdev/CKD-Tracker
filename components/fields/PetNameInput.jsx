"use client"

import '../style.css';

import Autocomplete from "@mui/material/Autocomplete";
import TextField from '@mui/material/TextField';

import { useBloodTestContext } from "../../context/BloodTestContext";
import { useChartContext } from '@/context/ChartContext';


export default function PetNameInput() {
    const { savedPetNames } = useBloodTestContext();
    const { chosenPetName, setChosenPetName } = useChartContext();

    return(

        <div>
            <Autocomplete
                className='input-wide'
                freeSolo                // allows free typing
                options={savedPetNames.map(opt => opt.value)} // dropdown options
                value={chosenPetName}
                onChange={(e, newValue) => setChosenPetName(newValue)}
                onInputChange={(e, newInput) => setChosenPetName(newInput)}
                renderInput={(params) => (
                <TextField {...params} label="Pet name" className="input-wide" />
                )}
            />
        </div>
    )
}