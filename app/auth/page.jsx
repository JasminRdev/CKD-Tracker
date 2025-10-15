"use client"

import { useState } from 'react'
import { signIn, signInWithGoogle, signUp, signOut } from '../lib/auth'
import useUser from '../lib/useUser'
import { useRouter } from 'next/navigation'
import { FormControl, InputLabel, Input, FormHelperText ,
  OutlinedInput,} from "@mui/material";
import Menu from '../../components/Menu'
import PasswordInput from '../../components//input/PasswordInput'

import { useLoadingContext} from '../../context/LoadingContext';

import Button from '@mui/material/Button';
import '../../components/style.css';

export default function Auth() {
  const user = useUser();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [emailSignUp, setEmailSignUp] = useState('')
  const [passwordSignUp, setPasswordSignUp] = useState('')

  const router = useRouter()



  const handleEmailLogin = async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      await signIn(email, password)
      alert('Logged in!')
      if(!document.location.href.includes("Test")){
          router.push('/chart') 
      }
    } catch (err) {
      alert(err.message)
    }
    setLoading(false)
  }
  
  const handleEmailSignUp = async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      await signUp(emailSignUp, passwordSignUp)
      alert('Signed up!')
      if(!document.location.href.includes("Test")){
          router.push('/chart') 
      }
    } catch (err) {
      alert(err.message)
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
      if(!document.location.href.includes("Test")){
          router.push('/chart') 
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error(err)
    }
  }

  const {loading, setLoading} = useLoadingContext();

  return (
    <div>
      <Menu />

      <div className='auth-wrapper'>

      { user ? (
            <div className='auth-grid'>
            <Button onClick={handleSignOut} variant="contained">
                Sign out
            </Button>
          </div>
          )
        : (
          <>
            <div className='auth-flex'>
              <Button onClick={handleGoogleLogin} className="auth-btn-full" variant="contained">
                  Sign in with Google
              </Button>
              <Button onClick={handleGoogleLogin} className="auth-btn-full" variant="contained">
                  Log in with Google
              </Button>
            </div>

            <span className='auth-separation-form'>or</span>
            <div className='auth-manual-form'>
              <div className='auth-container-item'>
                <h1>Login</h1>
                <form onSubmit={handleEmailLogin}>
                  <FormControl>
                    <InputLabel htmlFor="my-input">Email address</InputLabel>
                    <OutlinedInput
                      key="email-sign-in"
                      id="email-in-input"
                      required
                      type="email"
                      label="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>
                  <PasswordInput
                    id={"login"}
                    password={password}
                    setPassword={setPassword}
                  />
                  <Button variant="contained" type="submit">
                    Login
                    </Button>
                </form>
              </div>

              <div className='auth-container-item'>
                  <h1>Sign Up</h1>
                  <form onSubmit={handleEmailSignUp}>
                    <FormControl>
                      <InputLabel htmlFor="my-input">Email address</InputLabel>
                      <OutlinedInput
                        key="email-sign-up"
                        id="email-input"
                        required
                        type="email"
                        label="Email address"
                        value={emailSignUp}
                        onChange={(e) => setEmailSignUp(e.target.value)}
                      />
                    </FormControl>
                    <PasswordInput
                      id={"signup"}
                      password={passwordSignUp}
                      setPassword={setPasswordSignUp}
                    />
                    <Button disabled={loading} variant="contained" type="submit">
                      Sign In
                    </Button>
                  </form>
                </div>
            </div>
              


              
          </>
        )
        }
        
        
        </div>
      </div>
      
  )
}