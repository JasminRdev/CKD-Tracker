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
        case e.includes("A/G-Quotient"):
          e.match(/\d+/) && (a_AGQuotientVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("a_AGQuotientVal", a_AGQuotientVal)
          
          break;
        case e.includes("T4"):
          e.match(/\d+/) && (a_T4Val = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("t4", a_T4Val)
          
          break;
        case e.includes("hämatokrit"):
          e.match(/\d+/) && (a_hämatokritVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("a_hämatokritVal", a_hämatokritVal)
          
          break;
        case e.includes("hämaglobin"):
          e.match(/\d+/) && (a_hämaglobinVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("a_hämaglobinVal", a_hämaglobinVal)
          
          break;
        case e.includes("Retikulozyten"):
          e.match(/\d+/) && (a_retikulozytenVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("a_retikulozytenVal", a_retikulozytenVal)
          
          break;
        case e.includes("Ret-He"):
          e.match(/\d+/) && (a_retHeVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("a_retHeVal", a_retHeVal)
          
          break;
        case e.includes("Amylase"):
          e.match(/\d+/) && (b_alphaAmylaseVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("b_alphaAmylaseVal", b_alphaAmylaseVal)
          
          break;
        case e.includes("DGGR-Lipase"):
          e.match(/\d+/) && (b_dggrLipaseVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("b_dggrLipaseVal", b_dggrLipaseVal)
          
          break;
        case e.includes("Glucose"):
          e.match(/\d+/) && (b_glukoseVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("b_glukoseVal", b_glukoseVal)
          
          break;
        case e.includes("Fructosamin"):
          e.match(/\d+/) && (b_fuctosaminVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("b_fuctosaminVal", b_fuctosaminVal)
          
          break;
        case e.includes("Trigiyceride"):
        case e.includes("Triglyceride"):
          e.match(/\d+/) && (b_triglyzerideVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("b_triglyzerideVal", b_triglyzerideVal)
          
          break;
        case e.includes("Cholesterin"):
          e.match(/\d+/) && (b_cholesterinVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("b_cholesterinVal", b_cholesterinVal)
          
          break;
        case e.includes("Bilirubin"):
        case e.includes("Bülrubin"):
          e.match(/\d+/) && (b_bilirubinVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("b_bilirubinVal", b_bilirubinVal)
          
          break;
        case e.includes("AP"):
          e.match(/\d+/) && (b_APVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("b_APVal", b_APVal)
          
          break;
        case e.includes("GLDH"):
          e.match(/\d+/) && (b_GLDHVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("b_GLDHVal", b_GLDHVal)
          
          break;
        case e.includes("G-GT"):
          e.match(/\d+/) && (b_GGTVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("b_GGTVal", b_GGTVal)
          
          break;
        case e.includes("ALT"):
          e.match(/\d+/) && (b_ALTVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("b_ALTVal", b_ALTVal)
          
          break;
        case e.includes("AST"):
          e.match(/\d+/) && (b_ASTVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("b_ASTVal", b_ASTVal)
          
          break;
        case e.includes("CK"):
          e.match(/\d+/) && (b_CKVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("b_CKVal", b_CKVal)
          
          break;
        case e.includes("Protein"):
          e.match(/\d+/) && (b_gesamtProteinVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("b_gesamtProteinVal", b_gesamtProteinVal)
          
          break;
        case e.includes("Globuline"):
          e.match(/\d+/) && (b_globulineVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("b_globulineVal", b_globulineVal)
          
          break;
        // case e.includes("Leukozyten"):
        //   e.match(/\d+/) && (c_leukozytenVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
        //   console.log("c_leukozytenVal", c_leukozytenVal)
          
        //   break;
        case e.includes("Neutrophile"):
          e.match(/\d+/) && (c_neutrophileVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("c_neutrophileVal", c_neutrophileVal)
          
          break;
        // case e.includes("Lymphazyien"):
        // case e.includes("Lymphozyten"):
        //   e.match(/\d+/) && (c_lymphozytenVal = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
        //   console.log("c_lymphozytenVal", c_lymphozytenVal)
          
        //   break;
        // case e.includes("Thrombozyten"):
        //   e.match(/\d+/) && (c_thrombozyten = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
        //   console.log("c_thrombozyten", c_thrombozyten)
          
        //   break;
        case e.includes("MCV"):
          e.match(/\d+/) && (c_MCV = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("c_MCV", c_MCV)
          
          break;
        case e.includes("MCH"):
          e.match(/\d+/) && (c_MCH = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("c_MCH", c_MCH)
          
          break;
        case e.includes("MCHC"):
          e.match(/\d+/) && (c_MCHC = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("c_MCHC", c_MCHC)
          
          break;
        case e.includes("Hypochromasie"):
          e.match(/\d+/) && (c_hypochromasie = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("c_hypochromasie", c_hypochromasie)
          
          break;
        case e.includes("Anisozytose"):
          e.match(/\d+/) && (c_anisozytose = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
          console.log("c_anisozytose", c_anisozytose)
          
          break;
        // case e.includes("Monozyten"):
        // case e.includes("Monazyten"):
        //   e.match(/\d+/) && (c_monozyten = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
        //   console.log("c_monozyten", c_monozyten)
          
        //   break;
        // case e.includes("Eosinophile"):
        // case e.includes("Eoenophie"):
        //   e.match(/\d+/) && (c_eosinophile = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
        //   console.log("c_eosinophile", c_eosinophile)
          
        //   break;
        // case e.includes("Basophile"):
        // case e.includes("Basaph"):
        //   e.match(/\d+/) && (c_basophile = Number(e.match(/\d+\.\d+|\d+/)?.[0]));
        //   console.log("c_basophile", c_basophile)
          
        //   break;
        
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



