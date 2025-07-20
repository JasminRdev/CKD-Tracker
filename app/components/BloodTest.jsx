//blood test

//extract data from file 
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
import useUser from '../lib/useUser'

export default function UploadExtractSave() {
  const [file, setFile] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [loading, setLoading] = useState(false);
  const user = useUser();

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleExtractAndSave = async () => {
    if (!file) return alert('Upload an image first!')
    setLoading(true)

    // 1. Extract text
    const { data: { text } } = await Tesseract.recognize(file, 'deu')
    setExtractedText(text)

    // 2. Parse text here to structured data (example: just raw text for now)
    const parsedData = { raw_text: text }

    // 3. Get current user
    if (!user) return alert('Please sign in first!')

    // 4. Save extracted data to DB
    // const { data, error } = await supabase
    //   .from('bloodtest_data')
    //   .insert([{ user_id: user.id, data: parsedData }])

    // if (error) console.error(error)
    // else alert('Data saved successfully!')

    // setLoading(false)
    // console.log("would save to db : ", user.id, parsedData)
     // Split text into lines and filter out empty lines
  const linesArray = text.split('\n').map(line => line.trim()).filter(line => line !== '')

  console.log(linesArray)
  
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
    let a_AVGQuotientVal; // Marker - aber eher unspezifisch
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
    let c_leukozytenVal; //entzündungs- & infektionszeichen
    let c_neutrophileVal; //entzündungs- & infektionszeichen
    let c_lymphozytenVal; //entzündungs- & infektionszeichen
    let c_thrombozyten; //gerinnung
    let c_MCV; //erythrozytenindizes - feindiagnostik bei anämie
    let c_MCH; //erythrozytenindizes - feindiagnostik bei anämie
    let c_MCHC; //erythrozytenindizes - feindiagnostik bei anämie
    let c_hypochromasie; //erythrozytenveränderungen
    let c_anisozytose; //erythrozytenveränderungen
    let c_monozyten; //immunzellen
    let c_eosinophile; //immunzellen
    let c_basophile; //immunzellen

    linesArray.forEach((e) => {
      const expr = true;
      switch (expr) {
        case e.includes("Kreatinin"):
          e.match(/\d+/) && (a_kreatininVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("a_kreatininVal", a_kreatininVal)
          
          break;
        case e.includes("harnstoff"):
        case e.includes("Hamsto"):
          e.match(/\d+/) && (a_harnstoffVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("a_harnstoffVal", a_harnstoffVal, e )
          
          break;
        case e.includes("Phosphat"):
          e.match(/\d+/) && (a_phosphatVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("a_phosphatVal", a_phosphatVal)
          
          break;
        case e.includes("Kalium"):
          e.match(/\d+/) && (a_kaliumVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("a_kaliumVal", a_kaliumVal)
          
          break;
        case e.includes("Kalzium"):
          e.match(/\d+/) && (a_kalziumVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("a_kalziumVal", a_kalziumVal)
          
          break;
        case e.includes("Natrium"):
          e.match(/\d+/) && (a_natriumVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("a_natriumVal", a_natriumVal)
          
          break;
        case e.includes("Chlorid"):
          e.match(/\d+/) && (a_chloridVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("a_chloridVal", a_chloridVal)
          
          break;
        case e.includes("Albumin"):
          e.match(/\d+/) && (a_albuminVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("a_albuminVal", a_albuminVal)
          
          break;
        case e.includes("Eisen"):
          e.match(/\d+/) && (a_eisenVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("a_eisenVal", a_eisenVal)
          
          break;
        case e.includes("Magnesium"):
          e.match(/\d+/) && (a_magnesiumVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("a_magnesiumVal", a_magnesiumVal)
          
          break;
        //not readable in doc
        case e.includes("Na-/K-Quotient"):
          e.match(/\d+/) && (a_naKQuotientVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("a_naKQuotientVal", a_naKQuotientVal)
          
          break;
        case e.includes("blood"):
          e.match(/\d+/) && (bloodVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("blood", bloodVal)
          
          break;
        case e.includes("blood"):
          e.match(/\d+/) && (bloodVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("blood", bloodVal)
          
          break;
        case e.includes("blood"):
          e.match(/\d+/) && (bloodVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("blood", bloodVal)
          
          break;
        case e.includes("blood"):
          e.match(/\d+/) && (bloodVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("blood", bloodVal)
          
          break;
        case e.includes("blood"):
          e.match(/\d+/) && (bloodVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("blood", bloodVal)
          
          break;
        case e.includes("blood"):
          e.match(/\d+/) && (bloodVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("blood", bloodVal)
          
          break;
        case e.includes("blood"):
          e.match(/\d+/) && (bloodVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("blood", bloodVal)
          
          break;
        case e.includes("blood"):
          e.match(/\d+/) && (bloodVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("blood", bloodVal)
          
          break;
        case e.includes("blood"):
          e.match(/\d+/) && (bloodVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("blood", bloodVal)
          
          break;
        default:
          console.log(`Sorry, we are out of ${expr}.`);
          setLoading(false);
      }
    })
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



