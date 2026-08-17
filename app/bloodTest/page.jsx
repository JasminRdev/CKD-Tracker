"use client"


import CircularProgress from '@mui/material/CircularProgress';

import { useInView } from "react-intersection-observer";

import BloodTest from '../../components/BloodTest.jsx'

//comp
import Documents from '../../components/Documents'
import Form from '../../components/Form'
import Overlayer from '../../components/Overlayer'
import Menu from '../../components/Menu'
//style
import '../globals.css';

//context
import { useLoadingContext } from '../../context/LoadingContext';

export default function bloodTest() {
  // useLoadingContext
  const { loading, showOverlay} = useLoadingContext();

  const { ref, inView } = useInView({
    rootMargin: "80px 0px 0px 0px",
    threshold: 0,
  });

    return (
        <div>
          <Menu />
          
            <>
              {showOverlay && 
                <div>
                  <Overlayer />
                </div>
              }
              {loading && 
                <>
                  <div className='absoluteLoading__text'> 
                    Please wait, this may take a while
                  </div>
                  <div className="absoluteLoading">
                    <div className='loadingIcon'>
                      <CircularProgress size="6rem" />
                    </div>
                  </div>
                </>
              }
              <div className='bloodtest-wrapper'>
                <Documents />
                <div className='bloodtest-upload-comps'>
                  <div ref={ref} >
                    <BloodTest />
                  </div>

                  <Form inView={inView} />
                </div>
              </div>
            </>
          
        </div>
    );
  }
