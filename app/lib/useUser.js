// lib/useUser.js
"use client"

import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function useUser() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check on mount
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return user
}
