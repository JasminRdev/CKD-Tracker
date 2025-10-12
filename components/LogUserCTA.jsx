"use client"

import './style.css';


import Button from '@mui/material/Button';

import { useLoadingContext } from '../context/LoadingContext';



import { signIn, signInWithGoogle, signUp, signOut } from '../app/lib/auth'


export default function LogUserCTA() {
    const {foundUser, loading} = useLoadingContext();

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
            foundUser ? (
                  <Button 
                    className="menu-log-cta out"
                    sx={{ backgroundColor: 'black', p: 2 }} variant="contained"
                    onClick={handleSignOut}
                  >Log Out</Button>
            ) 
            : ( <Button 
                        className="menu-log-cta"
                        variant="contained"
                        onClick={handleGoogleLogin}
                    >Log In
                  </Button>
            )
        }
        </>
    );
  };
}
