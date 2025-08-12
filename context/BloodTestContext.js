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
  
    const [form, setForm] = useState([
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

    const keywordMapping = [
      { keyword: ["Kalium"], key: "a_kaliumVal" },
      { keyword: ["Kalzium"], key: "a_kalziumVal" },
      { keyword: ["Natrium"], key: "a_natriumVal" },
      { keyword: ["Chlorid"], key: "a_chloridVal" },
      { keyword: ["Albumin"], key: "a_albuminVal" },
      { keyword: ["Eisen"], key: "a_eisenVal" },
      { keyword: ["Magnesium"], key: "a_magnesiumVal" },
      { keyword: ["Na-/K-Quotient"], key: "a_naKQuotientVal" },
      { keyword: ["A/G-Quotient"], key: "a_AGQuotientVal" },
      { keyword: ["T4"], key: "a_T4Val" },
      { keyword: ["hämatokrit"], key: "a_hämatokritVal" },
      { keyword: ["hämaglobin"], key: "a_hämaglobinVal" },
      { keyword: ["Retikulozyten"], key: "a_retikulozytenVal" },
      { keyword: ["Ret-He"], key: "a_retHeVal" },
      { keyword: ["Amylase"], key: "b_alphaAmylaseVal" },
      { keyword: ["DGGR-Lipase"], key: "b_dggrLipaseVal" },
      { keyword: ["Glucose"], key: "b_glukoseVal" },
      { keyword: ["Fructosamin"], key: "b_fuctosaminVal" },
      { keyword: ["Triglyceride", "Trigiyceride"], key: "b_triglyzerideVal" },
      { keyword: ["Cholesterin"], key: "b_cholesterinVal" },
      { keyword: ["Bülrubin", "Bilirubin"], key: "b_bilirubinVal" },
      { keyword: ["AP"], key: "b_APVal" },
      { keyword: ["GLDH"], key: "b_GLDHVal" },
      { keyword: ["G-GT"], key: "b_GGTVal" },
      { keyword: ["ALT"], key: "b_ALTVal" },
      { keyword: ["AST"], key: "b_ASTVal" },
      { keyword: ["CK"], key: "b_CKVal" },
      { keyword: ["Protein"], key: "b_gesamtProteinVal" },
      { keyword: ["Globuline"], key: "b_globulineVal" },
      { keyword: ["Neutrophile"], key: "c_neutrophileVal" },
      { keyword: ["MCV"], key: "c_MCV" },
      { keyword: ["MCH"], key: "c_MCH", exclude: "MCHC" },
      { keyword: ["MCHC"], key: "c_MCHC" },
      { keyword: ["Hypochromasie"], key: "c_hypochromasie" },
      { keyword: ["Anisozytose"], key: "c_anisozytose" }
    ];


  const handleExtractAndSave = async (file) => {
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
    <BloodTestContext.Provider value={{ handleExtractAndSave, extractedText, form, setForm }}>
      {children}
    </BloodTestContext.Provider>
  );
};

export const useBloodTestContext = () => useContext(BloodTestContext);
