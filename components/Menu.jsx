"use client"

import Notification_warn from "../components/Notification_warn"
import { useLoadingContext } from '../context/LoadingContext';

import * as React from 'react';
import Button from '@mui/material/Button';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { useState } from 'react'
import { signIn, signInWithGoogle, signUp, signOut } from '../app/lib/auth'

//style
import './style.css';


import useUser from '../app/lib/useUser'


  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error(err)
    }
  }

  
    const handleGoogleLogin = async () => {
      try {
        await signInWithGoogle()
      } catch (err) {
        console.error(err)
      }
    }
  

export default function Menu() {
  const [menuOpen, setMenuOpen] = useState(false);

  const user = useUser();
  return (
    <>
    <Notification_warn />
    
    <div className='menu-wrapper-space' >
    </div>
    <div className='menu-wrapper' >
       
        <span className={`menu-overlay ${!menuOpen ? 'hide' : ''}`}>
            <div>coming soon</div>
        </span>
         {
            menuOpen ? 
            <CloseRoundedIcon className='menu-icon' onClick={() => setMenuOpen(false)} />
            :
            <MenuRoundedIcon className='menu-icon' onClick={() => setMenuOpen(true)} />
        }
        {  
            user ? (
                <>
                    <div className='menu-logged'>
                        Logged In <AccountCircleRoundedIcon fontSize="large" color="success" />
                    </div>
                    <Button 
                        sx={{ backgroundColor: 'black', p: 2 }} variant="contained"
                        onClick={handleSignOut}
                    >Log Out</Button>
                </>
            ) 
            : ( <>
                    <div className='menu-logged'>
                        Logged Out <AccountCircleRoundedIcon fontSize="large" />
                    </div>
                    <Button 
                        variant="contained"
                        onClick={handleGoogleLogin}
                    >Log In</Button>
                </>
            )
        }
    </div>
    </>
  );
}
