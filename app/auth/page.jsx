"use client"

import { useState } from 'react'
import { signIn, signInWithGoogle, signUp, signOut } from '../lib/auth'
import { useRouter } from 'next/navigation'

import Menu from '../../components/Menu'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [emailSignUp, setEmailSignUp] = useState('')
  const [passwordSignUp, setPasswordSignUp] = useState('')

  const router = useRouter()



  const handleEmailLogin = async (e) => {
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
  }
  
  const handleEmailSignUp = async (e) => {
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

  return (
    <div>
      <Menu />
      <h1>Login</h1>
      <form onSubmit={handleEmailLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      <br></br>



       <h1>Sign Up</h1>
      <form onSubmit={handleEmailSignUp}>
        <input
          type="email"
          value={emailSignUp}
          onChange={(e) => setEmailSignUp(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={passwordSignUp}
          onChange={(e) => setPasswordSignUp(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Sign Up</button>
      </form>

      <br></br>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
      <button onClick={handleSignOut}>Sign out</button>
      </div>
  )
}
