// BloodTestContext.js
"use client"; 

import { createContext, useContext, useState } from 'react';
import Tesseract from 'tesseract.js'
import { supabase } from '../app/lib/supabaseClient'
import { useLoadingContext } from './LoadingContext';
const BloodTestContext = createContext();

export const BloodTestProvider = ({ children }) => {
  
  const {setLoading} = useLoadingContext();
  const [extractedText, setExtractedText] = useState('')
  const [file, setFile] = useState(null)

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
      { name: "a_hämaglobinVal", value: "" },
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
      { name: "c_anisozytose", value: "" }
    ]);
    const [form, setForm] = useState(getInitialForm);
    const resetForm = () => {
      setForm(getInitialForm)
    }

    //Chart Comp
      const testResults = [
    { date: '01', Kreatinin: 139, Protein: 62.5 },
    { date: '02', Kreatinin: 139, Protein: 62.5 },
    { date: '03', Kreatinin: 133, Protein: 62.5 },
    { date: '05', Kreatinin: 135, Protein: 62 },
    { date: '07', Kreatinin: 133, Protein: 62 },
  ];

    //Form Comp - possible Value DB (::TODO) + bloodtest value setForm
    const keywordMapping = [
      { keyword: ["Protein"], key: "b_gesamtProteinVal", min: 57, max:94,value: ""  },
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
      { keyword: ["hämaglobin"], key: "a_hämaglobinVal", value: "" },
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
      // uploadDocToDB(file, user.id);
      const session = await supabase.auth.getSession();
      console.log(session.data.session?.user?.app_metadata);
      setLoading(true)

      // 1. Extract text
      const { data: { text } } = await Tesseract.recognize(file, 'deu')
      setExtractedText(text)

      // 2. Parse text here to structured data (example: just raw text for now)
      const parsedData = { raw_text: text }

    const linesArray = text.split('\n').map(line => line.trim()).filter(line => line !== '')

    console.log(linesArray)
    
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

    console.log(form);

    setLoading(false)

  }

  return (
    <BloodTestContext.Provider value={{ keywordMapping, resetForm, file, setFile, handleExtractAndSave, extractedText, form, setForm }}>
      {children}
    </BloodTestContext.Provider>
  );
};

export const useBloodTestContext = () => useContext(BloodTestContext);
