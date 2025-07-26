// last step
  // comp/chart.jsx
  // show val and styling
  // ideas to missing months

//todo 
  //visulize extracted data
  //add editable extracted data in the visualized data
  //add/delete datas
  //dashboard for uploaded files 
  //dashboard for additional notes that are linked to the diagrams from visualized data
  //export function for vet etc
  //pets data overview
  //medical informations to tracked values - to high / to low consequences

//done
  // extract doc data /bloodtest
  // started line chart /chart

//old done
  // login/registration authentication
  // connection to supabase db



//upload file to supabase storage
const uploadFile = async (file, userId) => {
  const { data, error } = await supabase
    .storage
    .from('documents')
    .upload(`${userId}/${file.name}`, file)

  if (error) {
    console.error('File upload error:', error)
    return null
  }
  
  const { publicURL } = supabase
    .storage
    .from('documents')
    .getPublicUrl(`${userId}/${file.name}`)

  return publicURL
}



//insert metadata in db
const saveData = async (userId, testType, extractedData, fileUrl) => {
  const { data, error } = await supabase
    .from('bloodtest_data')
    .insert([{
      user_id: userId,
      test_type: testType,
      data: extractedData,
      file_url: fileUrl
    }])

  if (error) console.error('DB insert error:', error)
  else console.log('Saved to DB:', data)
}



//basic auth
import { supabase } from '../lib/supabaseClient'

// Sign up
const signUp = async (email, password) => {
  const { user, error } = await supabase.auth.signUp({ email, password })
  if (error) console.error(error)
  else console.log('User signed up:', user)
}

// Sign in
const signIn = async (email, password) => {
  const { user, error } = await supabase.auth.signIn({ email, password })
  if (error) console.error(error)
  else console.log('User signed in:', user)
}

// Sign out
const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) console.error(error)
}








//extract data from file 
import Tesseract from 'tesseract.js'

const extractTextFromImage = async (file) => {
  const { data: { text } } = await Tesseract.recognize(file, 'eng', {
    logger: m => console.log(m)
  })
  return text
}




//save extracted data 
const saveExtractedData = async (userId, extractedData) => {
  const { data, error } = await supabase
    .from('bloodtest_data')
    .insert([{ user_id: userId, data: extractedData }])
  if (error) console.error(error)
  else console.log('Data saved:', data)
}




//example flow react comp - Upload image → extract text → parse data → save to DB
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Tesseract from 'tesseract.js'

export default function UploadExtractSave() {
  const [file, setFile] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleExtractAndSave = async () => {
    if (!file) return alert('Upload an image first!')
    setLoading(true)

    // 1. Extract text
    const { data: { text } } = await Tesseract.recognize(file, 'eng')
    setExtractedText(text)

    // 2. Parse text here to structured data (example: just raw text for now)
    const parsedData = { raw_text: text }

    // 3. Get current user
    const user = supabase.auth.user()
    if (!user) return alert('Please sign in first!')

    // 4. Save extracted data to DB
    const { data, error } = await supabase
      .from('bloodtest_data')
      .insert([{ user_id: user.id, data: parsedData }])

    if (error) console.error(error)
    else alert('Data saved successfully!')

    setLoading(false)
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleExtractAndSave} disabled={loading}>
        {loading ? 'Processing...' : 'Extract & Save'}
      </button>
      <pre>{extractedText}</pre>
    </div>
  )
}





//gmail auth

import { supabase } from '../lib/supabaseClient'

const signInWithGoogle = async () => {
  const { user, session, error } = await supabase.auth.signIn({
    provider: 'google',
  })
  if (error) console.error('Error:', error)
  // The user will be redirected to Google login page
}


//and
await supabase.auth.signIn({
  provider: 'google',
}, { redirectTo: 'https://yourappdomain.com/' })







//test type 
const getTestsByType = async (userId, type) => {
  const { data, error } = await supabase
    .from('bloodtest_data')
    .select('*')
    .eq('user_id', userId)
    .eq('test_type', type) // 'blood' or 'urine'
}


// A React app to track my cat’s chronic kidney 
// disease by visualizing blood and urine test results 
// over time - . Built with Supabase (a new tool I’m learning)
// as backend database and authentication service. 
// Helps monitor health trends and supports better care 
// through clear, interactive charts.