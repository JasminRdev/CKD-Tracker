import { supabase } from './supabaseClient'

// Email sign up
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

// Email sign in
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return data
}

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Google Sign In
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  })
  if (error) throw error
  return data
}
