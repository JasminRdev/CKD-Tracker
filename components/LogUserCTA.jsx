"use client"

import { useState } from 'react'
import './style.css';

import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useRouter } from 'next/navigation'


import Button from '@mui/material/Button';

import { useLoadingContext } from '../context/LoadingContext';

import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';

import { signIn, signInWithGoogle, signUp, signOut } from '../app/lib/auth'


export default function LogUserCTA() {
  const {foundUser, loading} = useLoadingContext();
    
  const router = useRouter()

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
    

    
   {
    return (
        <>
             {  
            foundUser ? 
            (<Button 
                className="menu-log-cta out"
                sx={{ backgroundColor: 'black', p: 2 }} variant="contained"
                onClick={handleSignOut}
                >
                    <LogoutRoundedIcon /> Log Out
            </Button>
            ) 
            : (
                <div className='menu-log-wrapper'>
                    <Button 
                        className="menu-log-cta in"
                        onClick={() => {handleGoogleLogin()}}
                    >
                        Log in</Button>

                        <div className='menu-header-abs'>
                            <div className='menu-header-logging-drp' onClick={() => { router.push('/auth')}}><LaunchRoundedIcon /> other options</div>
                        </div>
                </div>
                
                
            )
        }
        </>
    );
  };
}
