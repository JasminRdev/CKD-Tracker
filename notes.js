// last step
  // comp/Form.jsx context inputs + send to db 

  

    
// next
  //useContext to handle test data input that gets saved to db
    // -> from Form Comp (manual Input) or Bloodtest Comp (doc extraction)
    // -> edit/add Inputs Comp not yet created

//todo
  //   visulize extracted data
  //add editable extracted data in the visualized data
  //add/delete datas
  //dashboard for uploaded files
  //dashboard for additional notes that are linked to the diagrams from visualized data
  //export function for vet etc
  //pets data overview
  //medical informations to tracked values - to high / to low consequences
  // global Loading comp 

//done
  // Form Comp with their data input context + saving to db
  //loading context
  //supabase policy for bloodtest table read, add and delete
  // add data to db from input
  // added user specific data values for the tests, able to flag as important, fav etc
  // filter test data in main chart
  // separate charts for indivisual datas

//old done
  // login/registration authentication
  // connection to supabase db
  // extract doc data /bloodtest
  // started line chart /chart

// details
  // ideas to missing months
  // upload with only admin (upload general doent work with current security rules)
  // form formular details ux like when val sdma not there then not 0 but no val for this test
  // allow add data to db also without upload of doc -> only input form ui
  // added user specific data values for the tests, able to flag as important, fav etc
  // make as many inputs as we can find from the data vals from document that extracts the data
    // create useContext for all possible values (comp/BloodTest)
  // same for case of editing existing data in db, allow add/delete inputs
    //-> when adding inputs, anything possible as name, logic in graph to include, for cases when i only have once f.e. smda and not for other tests, that there is not graph, then there is only point?
    //-> then also in comp/chart.jsx adjust the toggle btn to how much we have at the db in our user specific table
      //-> to that we have to keep track of our values when adding inputs/data to db -> for each user we know then how many test values they track, those can be then also tagged with fav/häufigkeit etc



// comments to values

    //get val
    let a_kreatininVal; //sehr wichtig - maß für Nierenfunktion
    let a_harnstoffVal; // wichtig - steigt bei eingeschränkter Nierenleistung
    let a_phosphatVal; // wichtig - hoher Wert schädigt Nieren
    let a_kaliumVal; // wichtig - hypokaliämie häufig bei cni
    let a_kalziumVal; // wichtig - kontrollieren bei cni da Störungen im Mineralhaushalt auftreten 
    let a_natriumVal; // wichtig - Flüssigkeitsstatus zb Dehydration
    let a_chloridVal; // weniger relevant - aber im Gesamtkontext manchmal hilfreich
    let a_albuminVal; // wichtig - hinweis auf Proteinverluste über Urin (Proteinurie)
    let a_eisenVal; // relevant - falls Anämie abgeklärt wird
    let a_magnesiumVal; // kann relevant sein - zb bei Elektrolystörungen
    let a_naKQuotientVal; //Interessant - bei CNI oft verändert
    let a_AGQuotientVal; // ask chat gpt again
    let a_T4Val; // wichtig - schilddrüsenwert -> zur Abgrenzung zur Hyperthyreose die CNI maskieren kann
    let a_hämatokritVal; // relevant - anämiecheck
    let a_hämaglobinVal; // relevant - anämieprüfung, häufig bei cni erniedrigt
    let a_retikulozytenVal; // relevant bei cni-anämie - marker für Knochenmarkaktivität
    let a_retHeVal; // relevant - früher marker für eisenmangel bei cni anämie möglich

    //laut chatgpt nicht für cni relavant
    let b_alphaAmylaseVal; //bauchspeicheldrüse 
    let b_dggrLipaseVal; //bauchspeicheldrüse 
    let b_glukoseVal; //diabetesüberwachung
    let b_fuctosaminVal; //diabetesüberwachung
    let b_triglyzerideVal; //fettstoffwechsel - nur sekundär relevant 
    let b_cholesterinVal; //fettstoffwechsel - nur sekundär relevant 
    let b_bilirubinVal; //Leberwerte
    let b_APVal; //Leberwerte
    let b_GLDHVal; //Leberwerte
    let b_GGTVal; //Leberwerte
    let b_ALTVal; //Leberwerte
    let b_ASTVal; //Leberwerte
    let b_CKVal; //Muskelwerte (Kreatinkinase)
    let b_gesamtProteinVal; //nur bedingt nützlich - eher bei Erzündungen etc
    let b_globulineVal; //nur bedingt nützlich - eher bei Erzündungen etc

    //weniger wichtig für CNI (aber allg interessant)
    // let c_leukozytenVal; //entzündungs- & infektionszeichen
    let c_neutrophileVal; //entzündungs- & infektionszeichen
    // let c_lymphozytenVal; //entzündungs- & infektionszeichen
    // let c_thrombozyten; //gerinnung
    let c_MCV; //erythrozytenindizes - feindiagnostik bei anämie
    let c_MCH; //erythrozytenindizes - feindiagnostik bei anämie
    let c_MCHC; //erythrozytenindizes - feindiagnostik bei anämie
    let c_hypochromasie; //erythrozytenveränderungen
    let c_anisozytose; //erythrozytenveränderungen
    // let c_monozyten; //immunzellen
    // let c_eosinophile; //immunzellen
    // let c_basophile; //immunzellen
 





  if (user?.app_metadata?.role === 'admin') {
  // show admin-only features
}

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