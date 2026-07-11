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
    //this arr for db ini 
    let getInitialForm = () => ([
      { name : "a_Kreatinin", value:"", keyword: ["Kreatinin"],  probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "a_kaliumVal", value: "" , keyword: ["Kalium"], probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "a_kalziumVal", value: "" ,  keyword: ["Kalzium"], probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "a_natriumVal", value: "" , keyword: ["Natrium"], probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "a_chloridVal", value: "" ,  keyword: ["Chlorid"], probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "a_albuminVal", value: "" , keyword: ["Albumin"], probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "a_eisenVal", value: "" ,  keyword: ["Eisen"],probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "a_magnesiumVal", value: "" ,  keyword: ["Magnesium"], probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "a_naKQuotientVal", value: "" ,  keyword: ["Na-/K-Quotient"],  probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "a_AGQuotientVal", value: "" ,  keyword: ["Na-/K-Quotient"],  probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "a_T4Val", value: "" ,keyword: ["T4"], probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "a_hämatokritVal", value: "" , keyword: ["hämatokrit"], probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "a_retikulozytenVal", value: "" ,keyword: ["Retikulozyten"], probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "a_retHeVal", value: "" , keyword: ["Ret-He"],probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "b_alphaAmylaseVal", value: "" , keyword: ["Amylase"], probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "b_dggrLipaseVal", value: "" , keyword: ["DGGR-Lipase"], probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "b_glukoseVal", value: "" ,keyword: ["Glucose"],  probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "b_fuctosaminVal", value: "" ,  keyword: ["Fructosamin"],probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "b_triglyzerideVal", value: "" ,  keyword: ["Triglyceride", "Trigiyceride"], probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "b_cholesterinVal", value: "" ,keyword: ["Cholesterin"], probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "b_bilirubinVal", value: "" ,keyword: ["Bülrubin", "Bilirubin"],  probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "b_APVal", value: "" , keyword: ["AP"],probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "b_GLDHVal", value: "" , keyword: ["GLDH"], probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "b_GGTVal", value: "" , keyword: ["G-GT"],probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "b_ALTVal", value: "" , keyword: ["ALT"],  probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "b_ASTVal", value: "" , keyword: ["AST"], probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "b_CKVal", value: "" ,keyword: ["CK"],  probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "b_gesamtProteinVal", value: "" , keyword: ["Protein"], probe: "Serum", material: "Blut", datum: "2025-12-31",min: 57, max: 94},
      { name: "b_globulineVal", value: "" , keyword: ["Globuline"], probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "c_neutrophileVal", value: "" , keyword: ["Neutrophile"],probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "c_MCV", value: "" ,  keyword: ["MCV"],probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { keyword: ["MCH"], name: "c_MCH", exclude: "MCHC", value: "" , probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "c_MCHC", value: "" ,keyword: ["MCHC"],  probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "c_hypochromasie", value: "" , keyword: ["Hypochromasie"], probe: "Serum", material: "Blut", datum: "2025-12-31"},
      { name: "a_hämoglobinVal", value: "" ,  keyword: ["hämaglobin","hämoglobin"],  probe: "Serum", material: "Blut", min: 108, max:169, datum: "2025-12-31"},
      { name: "c_erythrozytenVal", value: "" ,  keyword: ["Erythrozyten"], probe: "Serum", material: "Blut",min:7.2, max:11, datum: "2025-12-31"},
      { name: "c_leukozytenVal", value: "" ,keyword: ["Leukozyten", "Leukoz"], probe: "Serum", material: "Blut", min:3.9, max:12.5, datum: "2025-12-31"},
      { name: "c_anisozytose" , keyword: ["Anisozytose"], value: "",probe: "Serum", material: "Blut"},
      { 
        name: "Index (urin)", value: "", keyword: ["Index"], probe: "Labor", material: "Urin",
        datum: "2022-05-14",
        min: 0,
        max: 0.2},
      { 
        name: "Calcium", value: "", keyword: ["Calcium"], probe: "Serum", material: "Blut",
        datum: "2022-05-14",
        min: 2.3,
        max: 3},
      { 
        name: "Ca ionisiert", value: "", keyword: ["Ca ion"], probe: "Serum", material: "Blut",
        datum: "2022-05-14",
        min: 1.07,
        max: 1.47},
      { 
        name: "Eiweiß (urin)", value: "", keyword: ["Eiweiß"], probe: "Labor", material: "Urin",
        datum: "2022-05-14"},
      { 
        name: "Krea. (urin)", value: "", keyword: ["Krea"], probe: "Labor", material: "Urin",
        datum: "2022-05-14"},
    ]);
    const [form, setForm] = useState(getInitialForm);
    const resetForm = () => {
      setForm(getInitialForm)
    }

    async function handleNewIniForm(cleanedForm) {

      const getPossibleValuesAdmin = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        const res = await fetch(`/api/getPossibleVal?pet=${chosenPetName}&lookForAdminsMatch=true`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        return json.data;
      };

      const checkMatchWithAdminForm = async () => {
        const rawData = await getPossibleValuesAdmin();
          const possibleValAdmin = rawData.map(item =>
            item.inputValues.map(str => {
              const parsed = JSON.parse(str);

              return Object.fromEntries(
                Object.entries(parsed)
                  .map(([key, value]) => [
                    key,
                    typeof value === "string" && value !== "" && !isNaN(value)
                    ? parseFloat(value)
                    : value
                  ])
              );
            })
          );
          const flatPossibleValAdmin = possibleValAdmin.flat();
          const dbAdminFormNotEqual = cleanedForm.some(a => {
            return !flatPossibleValAdmin.some(b => b.name === a.name);
          });
          // console.log("is NOT ------------ equal to aadmin form ", dbAdminFormNotEqual)
          return dbAdminFormNotEqual;
      }

      const getPossibleValueOwn = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        const res = await fetch(`/api/getPossibleVal?pet=${chosenPetName}&lookForAdminsMatch=false`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        return json.data;
      };
      let getCustomForm = await getPossibleValueOwn();

      if(getCustomForm.length == 0){
        let foundDifferToAdmin = await checkMatchWithAdminForm()
        if(foundDifferToAdmin){
          //save new form to own possi
          const { data: { session } } = await supabase.auth.getSession();
          const token = session?.access_token;
          const encoded = encodeURIComponent(JSON.stringify(cleanedForm));

          await fetch(`/api/postOwnPossi?pet=${chosenPetName}&form=${encoded}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
      }      

    }

    function resetNewList (){
      let getAgainIniForm = form.map(field => ({
        ...field,
        value: ""
      }));
      handleNewIniForm(getAgainIniForm);
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
    //this array for app - read img 
    const keywordMapping = [
      { keyword: ["Leukozyten", "Leukoz"], name: "c_leukozytenVal",min:3.9, max:12.5, value:""},
      { keyword: ["Erythrozyten"], name: "c_erythrozytenVal",min:7.2, max:11, value:""},
      { keyword: ["Protein"], name: "b_gesamtProteinVal", min: 57, max: 94,value: ""},
      { keyword: ["Kreatinin"], name: "a_Kreatinin", min: 0, max:168, value: ""  },
      { keyword: ["Kalium"], name: "a_kaliumVal", value: "" },
      { keyword: ["Kalzium"], name: "a_kalziumVal", value: "" },
      { keyword: ["Natrium"], name: "a_natriumVal", value: "" },
      { keyword: ["Chlorid"], name: "a_chloridVal", value: "" },
      { keyword: ["Albumin"], name: "a_albuminVal", value: "" },
      { keyword: ["Eisen"], name: "a_eisenVal", value: "" },
      { keyword: ["Magnesium"], name: "a_magnesiumVal", value: "" },
      { keyword: ["Na-/K-Quotient"], name: "a_naKQuotientVal", value: "" },
      { keyword: ["A/G-Quotient"], name: "a_AGQuotientVal", value: "" },
      { keyword: ["T4"], name: "a_T4Val", value: "" },
      { keyword: ["hämatokrit"], name: "a_hämatokritVal", value: "" },
      { keyword: ["hämaglobin","hämoglobin"], name:"a_hämoglobinVal", value: "", min: 108, max:169 },
      { keyword: ["Retikulozyten"], name: "a_retikulozytenVal", value: "" },
      { keyword: ["Ret-He"], name: "a_retHeVal", value: "" },
      { keyword: ["Amylase"], name: "b_alphaAmylaseVal", value: "" },
      { keyword: ["DGGR-Lipase"], name: "b_dggrLipaseVal", value: "" },
      { keyword: ["Glucose"], name: "b_glukoseVal", value: "" },
      { keyword: ["Fructosamin"], name: "b_fuctosaminVal", value: "" },
      { keyword: ["Triglyceride", "Trigiyceride"], name: "b_triglyzerideVal", value: "" },
      { keyword: ["Cholesterin"], name: "b_cholesterinVal", value: "" },
      { keyword: ["Bülrubin", "Bilirubin"], name: "b_bilirubinVal", value: "" },
      { keyword: ["AP"], name: "b_APVal", value: "" },
      { keyword: ["GLDH"], name: "b_GLDHVal", value: "" },
      { keyword: ["G-GT"], name: "b_GGTVal", value: "" },
      { keyword: ["ALT"], name: "b_ALTVal", value: "" },
      { keyword: ["AST"], name: "b_ASTVal", value: "" },
      { keyword: ["CK"], name: "b_CKVal", value: "" },
      { keyword: ["Globuline"], name: "b_globulineVal", value: "" },
      { keyword: ["Neutrophile"], name: "c_neutrophileVal", value: "" },
      { keyword: ["MCV"], name: "c_MCV", value: "" },
      { keyword: ["MCH"], name: "c_MCH", exclude: "MCHC", value: "" },
      { keyword: ["MCHC"], name: "c_MCHC", value: "" },
      { keyword: ["Hypochromasie"], name: "c_hypochromasie", value: "" },
      { keyword: ["Anisozytose"], name: "c_anisozytose" , value: "" },
      { keyword: ["Index"], name: "Index (urin)", value: "",
        min: 0,
        max: 0.7},
      { keyword: ["Eiweiß"], name: "Eiweiß (urin)", value: ""},
      { keyword: ["Krea"], name: "Krea. (urin)", value: ""}
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

      form.forEach(({ keyword, name, exclude }) => {
        if (exclude && line.includes(exclude)) return;
        if (keyword.some(k => line.includes(k))) {
          const field = form.find(f => f.name === name);
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

                                        
  const checkUsersLimit = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const res = await fetch(`/api/getUserSaveCount`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const count = await res.json();

    return count.data.length
  };                                                                                                                                                                                                                                                                                                                 

  return (
    <BloodTestContext.Provider value={{ 
      getNames, resetNewList,
    delDocs, editDocs, checkUsersLimit, bloodTestCompReset, 
      setBloodTestCompReset, getDocsImg, getDocImg, handleClickPreviewImg_fromDocs, 
      handleClickPreviewImg_forExtraction, handleFileChange, selectedImage, 
      setSelectedImage, chosenPetName, savedPetNames, allNames,
      resetForm, resetFileComp, fileKey, file, setFile, handleExtractAndSave, extractedText, form, setForm }}>
      {children}
    </BloodTestContext.Provider>
  );
};

export const useBloodTestContext = () => useContext(BloodTestContext);
