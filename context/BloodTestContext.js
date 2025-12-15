// BloodTestContext.js
"use client"; 

import { createContext, useContext, useEffect, useState } from 'react';
import Tesseract from 'tesseract.js'
import { supabase } from '../app/lib/supabaseClient'
import { useLoadingContext } from './LoadingContext';
import { useChartContext } from './ChartContext';

import useUser from '../app/lib/useUser'
const BloodTestContext = createContext();

export const BloodTestProvider = ({ children }) => {
  
  const user = useUser();
  const {loading, showOverlay, 
    setNotification_warn_message,
        setNotification_warn_color,
        setNotification_warn, setLoading, setShowOverlay, setOverlayerElement} = useLoadingContext();
  
  const [extractedText, setExtractedText] = useState('')
  const [file, setFile] = useState(null)

  const { chosenPetName } = useChartContext();

    const getInitialForm = () => ([
      { name : "a_Kreatinin", value:""},
      { name: "a_kaliumVal", value: "" },
      { name: "a_kalziumVal", value: "" },
      { name: "a_natriumVal", value: "" },
      { name: "a_chloridVal", value: "" },
      { name: "a_albuminVal", value: "" },
      { name: "a_eisenVal", value: "" },
      { name: "a_magnesiumVal", value: "" },
      { name: "a_naKQuotientVal", value: "" },
      { name: "a_AGQuotientVal", value: "" },
      { name: "a_T4Val", value: "" },
      { name: "a_hämatokritVal", value: "" },
      { name: "a_retikulozytenVal", value: "" },
      { name: "a_retHeVal", value: "" },
      { name: "b_alphaAmylaseVal", value: "" },
      { name: "b_dggrLipaseVal", value: "" },
      { name: "b_glukoseVal", value: "" },
      { name: "b_fuctosaminVal", value: "" },
      { name: "b_triglyzerideVal", value: "" },
      { name: "b_cholesterinVal", value: "" },
      { name: "b_bilirubinVal", value: "" },
      { name: "b_APVal", value: "" },
      { name: "b_GLDHVal", value: "" },
      { name: "b_GGTVal", value: "" },
      { name: "b_ALTVal", value: "" },
      { name: "b_ASTVal", value: "" },
      { name: "b_CKVal", value: "" },
      { name: "b_gesamtProteinVal", value: "" },
      { name: "b_globulineVal", value: "" },
      { name: "c_neutrophileVal", value: "" },
      { name: "c_MCV", value: "" },
      { name: "c_MCH", value: "" },
      { name: "c_MCHC", value: "" },
      { name: "c_hypochromasie", value: "" },
      { name: "a_hämoglobinVal", value: "" },
      { name: "c_erythrozytenVal", value: "" },
      { name: "c_leukozytenVal", value: "" },
    ]);
    const [form, setForm] = useState(getInitialForm);
    const resetForm = () => {
      setForm(getInitialForm)
    }

    //Chart Comp
  //     const testResults = [
  //   { date: '01', Kreatinin: 139, Protein: 62.5 },
  //   { date: '02', Kreatinin: 139, Protein: 62.5 },
  //   { date: '03', Kreatinin: 133, Protein: 62.5 },
  //   { date: '05', Kreatinin: 135, Protein: 62 },
  //   { date: '07', Kreatinin: 133, Protein: 62 },
  // ];

    //Form Comp - possible Value DB (::TODO) + bloodtest value setForm
    //05.03.24
    const keywordMapping = [
      { keyword: ["Leukozyten", "Leukoz"], key: "c_leukozytenVal",min:3.9, max:12.5, value:"", currency:"G/l"},
      { keyword: ["Erythrozyten"], key: "c_erythrozytenVal",min:7.2, max:11, value:"", currency:"T/l"},
      { keyword: ["Protein"], key: "b_gesamtProteinVal", min: 57, max: 94,value: "", currency:"" },
      { keyword: ["Kreatinin"], key: "a_Kreatinin", min: 0, max:168, value: ""  },
      { keyword: ["Kalium"], key: "a_kaliumVal", value: "" },
      { keyword: ["Kalzium"], key: "a_kalziumVal", value: "" },
      { keyword: ["Natrium"], key: "a_natriumVal", value: "" },
      { keyword: ["Chlorid"], key: "a_chloridVal", value: "" },
      { keyword: ["Albumin"], key: "a_albuminVal", value: "" },
      { keyword: ["Eisen"], key: "a_eisenVal", value: "" },
      { keyword: ["Magnesium"], key: "a_magnesiumVal", value: "" },
      { keyword: ["Na-/K-Quotient"], key: "a_naKQuotientVal", value: "" },
      { keyword: ["A/G-Quotient"], key: "a_AGQuotientVal", value: "" },
      { keyword: ["T4"], key: "a_T4Val", value: "" },
      { keyword: ["hämatokrit"], key: "a_hämatokritVal", value: "" },
      { keyword: ["hämaglobin","hämoglobin"], key:"a_hämoglobinVal", value: "", min: 108, max:169, currency:"g/l" },
      { keyword: ["Retikulozyten"], key: "a_retikulozytenVal", value: "" },
      { keyword: ["Ret-He"], key: "a_retHeVal", value: "" },
      { keyword: ["Amylase"], key: "b_alphaAmylaseVal", value: "" },
      { keyword: ["DGGR-Lipase"], key: "b_dggrLipaseVal", value: "" },
      { keyword: ["Glucose"], key: "b_glukoseVal", value: "" },
      { keyword: ["Fructosamin"], key: "b_fuctosaminVal", value: "" },
      { keyword: ["Triglyceride", "Trigiyceride"], key: "b_triglyzerideVal", value: "" },
      { keyword: ["Cholesterin"], key: "b_cholesterinVal", value: "" },
      { keyword: ["Bülrubin", "Bilirubin"], key: "b_bilirubinVal", value: "" },
      { keyword: ["AP"], key: "b_APVal", value: "" },
      { keyword: ["GLDH"], key: "b_GLDHVal", value: "" },
      { keyword: ["G-GT"], key: "b_GGTVal", value: "" },
      { keyword: ["ALT"], key: "b_ALTVal", value: "" },
      { keyword: ["AST"], key: "b_ASTVal", value: "" },
      { keyword: ["CK"], key: "b_CKVal", value: "" },
      { keyword: ["Globuline"], key: "b_globulineVal", value: "" },
      { keyword: ["Neutrophile"], key: "c_neutrophileVal", value: "" },
      { keyword: ["MCV"], key: "c_MCV", value: "" },
      { keyword: ["MCH"], key: "c_MCH", exclude: "MCHC", value: "" },
      { keyword: ["MCHC"], key: "c_MCHC", value: "" },
      { keyword: ["Hypochromasie"], key: "c_hypochromasie", value: "" },
      { keyword: ["Anisozytose"], key: "c_anisozytose" , value: "" }
    ];


  const handleExtractAndSave = async () => {
    setLoading(true)

    // 1. Extract text
    const { data: { text } } = await Tesseract.recognize(file, 'deu')
    setExtractedText(text)

    // 2. Parse text here to structured data (example: just raw text for now)
    // const parsedData = { raw_text: text }

    const linesArray = text.split('\n').map(line => line.trim()).filter(line => line !== '')

    linesArray.forEach((line) => {
      const numMatch = line.match(/\d+\.\d+|\d+/)?.[0];
      if (!numMatch) return;

      keywordMapping.forEach(({ keyword, key, exclude }) => {
        if (exclude && line.includes(exclude)) return;
        if (keyword.some(k => line.includes(k))) {
          const field = form.find(f => f.name === key);
          if (field) field.value = Number(numMatch);
        }
      });
    });

    setLoading(false)
  }

  const getPetName = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const res = await fetch("/api/getPetName", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    return json;
  };


  const [allNames, setAllNames] = useState([])
  const getNames = async () => {
    let names = await getPetName();
    setAllNames(prev => {
          const newNames = names.map(item => Object.values(item)[0]);
          return Array.from(new Set([...prev, ...newNames]));
    });
  }

  const savedPetNames = allNames
    .map(name => ({
      value: name,
      label: name
    }));

    

  const [getDocImg, setDocImg] = useState("")

  const getDocsImg = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const res = await fetch("/api/getDocs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return setDocImg(data);

  };

  const delDocs = async (fileUrl, id) => {
    setLoading(true)
    if(user == null){
      setNotification_warn(true)
      setNotification_warn_message("Please log in.")
      setNotification_warn_color("warning")
      
      setLoading(false)
      return
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(`/api/deleteDocs?fileUrl=${fileUrl}&docId=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      // If API sends 400/500, read the API error
      if (!res.ok) {
        throw new Error(data.error || "Unknown error");
      }
      // Success
      console.log(data.message);
      
      setNotification_warn(true)
      setNotification_warn_message("Successfull deleted.")
      setNotification_warn_color("success")
      await getDocsImg();

    } catch (err) {
      console.error("Delete error:", err.message);
      setNotification_warn(true)
      setNotification_warn_message(err.message)
      setNotification_warn_color("warning")
    }
    
    setLoading(false)
  };

  const editDocs = async (fileUrl, id, newFileName) => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(`/api/updateFileName?fileUrl=${fileUrl}&docId=${id}&newFileName=${newFileName}&petName=${petName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      // If API sends 400/500, read the API error
      if (!res.ok) {
        throw new Error(data.error || "Unknown error");
      }
      // Success
      console.log(data.message);
      
      setNotification_warn(true)
      setNotification_warn_message("Successfully changed.")
      setNotification_warn_color("success")
      await getDocsImg();

    } catch (err) {
      console.error("Delete error:", err.message);
      setNotification_warn(true)
      setNotification_warn_message(err.message)
      setNotification_warn_color("warning")
    }
    
    setLoading(false)
  };
  
  useEffect(() => {
    getNames()
    getDocsImg()
  },[])


  
  const [fileKey, setFileKey] = useState(Date.now());
  //overlay img to expand
  const [selectedImage, setSelectedImage] = useState(null)
  const handleFileChange = (e) => {
    resetForm(); //if not choosen multi files ::TODO

    const file = e.target.files[0];
    setFile(file)
    if (file) {
      setSelectedImage(URL.createObjectURL(file)); // creates preview link
    }

  }

  const resetFileComp = () => {
    resetForm(); //if not choosen multi files ::TODO

    setFileKey(Date.now())
    setSelectedImage(null)
    setFile(null)
  }
  
  
  function handleClickPreviewImg_forExtraction() {
    setShowOverlay(true)
    setOverlayerElement(<img 
                className='overlayerPreviewImg'
                src={selectedImage} 
                alt="previewBig" 
              />)
  }

  
  function handleClickPreviewImg_fromDocs(src) {
    setShowOverlay(true)
    setOverlayerElement(<img  
                className='overlayerPreviewImg'
                src={src} 
                alt="previewBig" 
              />)
  }

  const [bloodTestCompReset, setBloodTestCompReset] = useState(0)

  
  const checkUsersLimit = async (user_id) => {
    const res = await fetch(`/api/getUserSaveCount?user_id=${user_id}`);
    const count = await res.json();
    return count.data.length
  };

  return (
    <BloodTestContext.Provider value={{ 
      getNames,
    delDocs, editDocs, checkUsersLimit, bloodTestCompReset, 
      setBloodTestCompReset, getDocsImg, getDocImg, handleClickPreviewImg_fromDocs, 
      handleClickPreviewImg_forExtraction, handleFileChange, selectedImage, 
      setSelectedImage, chosenPetName, savedPetNames, allNames, keywordMapping, 
      resetForm, resetFileComp, fileKey, file, setFile, handleExtractAndSave, extractedText, form, setForm }}>
      {children}
    </BloodTestContext.Provider>
  );
};

export const useBloodTestContext = () => useContext(BloodTestContext);
