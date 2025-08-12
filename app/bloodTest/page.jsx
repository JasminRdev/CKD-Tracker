"use client"


import CircularProgress from '@mui/material/CircularProgress';


import useUser from '../lib/useUser'
import BloodTest from '../../components/BloodTest.jsx'

//comp
import Documents from '../../components/Documents'
import Form from '../../components/Form'

//style
import '../globals.css';

//context
import { useLoadingContext } from '../../context/LoadingContext';

export default function bloodTest() {
  // useLoadingContext
  const { loading, setLoading} = useLoadingContext();

  const user = useUser();
  if(!user) {
    return <p>Please log in</p>
  } else {
    return (
        <div >
          {loading && 
            <div className="absoluteLoading">
              <div className='loadingIcon'>
                <CircularProgress size="6rem" />
              </div>
            </div>
          }
            <BloodTest />
            
            <Documents />
            <Form />
        </div>
    );
  };
}
