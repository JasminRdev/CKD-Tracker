// BloodTestContext.js
"use client"; 

import { createContext, useContext, useEffect, useState } from 'react';
import Tesseract from 'tesseract.js'
import { supabase } from '../app/lib/supabaseClient'
import { useLoadingContext } from './LoadingContext';
import { useChartContext } from './ChartContext';

import useUser from '../app/lib/useUser'
const BloodTestContext = createContext();

import { useFormStore } from "../app/stores/useFormStore";

export const BloodTestProvider = ({ children }) => {
  
  const user = useUser();
  const {loading, showOverlay, 
    setNotification_warn_message,
        setNotification_warn_color,
        setNotification_warn, setLoading, setShowOverlay, setOverlayerElement} = useLoadingContext();
  
  const [extractedText, setExtractedText] = useState('')
  const [file, setFile] = useState(null)
  const { chosenPetName } = useChartContext();

  
  const { getForm, setForm, valueToRemoveInBetween, 
    setValueToRemoveInBetween,
    selectedType, setUsersUnits, usersUnits, newInput,newUnitForm, setNewUnitForm, iniNewUnitForm
   } = useFormStore()

   async function addUnitToDB () {
    console.log("addUnitToDB post")
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    await fetch(`/api/postUnit?pet=${chosenPetName}&testtype=${selectedType}&name=${newInput.name}&fromUnit=${newInput.unit}&settedUnit=${newInput.unit}&factor=1&offset=0`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setNewUnitForm(iniNewUnitForm)
   }
   
  const getUnits = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const res = await fetch(`/api/getAllUsersUnits?pet=${chosenPetName}&testtype=${selectedType}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    console.log("getUnits get", json.data)

    setUsersUnits(json.data);
  };
  

    //this arr for db ini 
  const [getInitialForm, setIniForm] = useState()

  async function addNewUnitToForm() {
    let factor = Number(newUnitForm.calcForFactor)/1000;
    console.log("addUnitToDB post to another unit ")
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    await fetch(`/api/postUnit?pet=${chosenPetName}&testtype=${selectedType}&name=${newUnitForm.name}&fromUnit=${newUnitForm.fromUnit}&settedUnit=${newUnitForm.settedUnit}&factor=${factor}&offset=0`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setNewUnitForm(iniNewUnitForm)
  }

  const fetchInitialForm = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const res = await fetch(`/api/getInputValues?pet=${chosenPetName}&testtype=${selectedType}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json(); 
    return json.data;
  };

  
  const fetchInitialFormTemplate = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const res = await fetch(`/api/getInputValues?&testtype=${selectedType}&autoForm=true`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    
    setIniForm(json.data) 
    setForm(json.data)
    console.log("getInputValues db fetch possiVals", json.data)
  };

  const resetForm = () => {
    setForm(getInitialForm)
  }

  function resetInputForm() {
    const fetchInputVal = async () => {
      let rawData = await fetchInitialForm();
      console.log("getInputValues db fetch possiVals", rawData)
      setIniForm(rawData)
      setForm(rawData)
    }
    fetchInputVal()
  }
    
  useEffect(() => {
    resetInputForm()
    getUnits()
  },[chosenPetName, selectedType])
    
  //when db api insert happend
  useEffect(() => {
    getUnits()
  },[getForm])
  
  useEffect(() => {
    resetInputForm()
    getUnits()
  },[])

    
  async function removeNameFromUnits() {
    console.log(' remove from unit too',valueToRemoveInBetween)
    for (const nameToRemove of valueToRemoveInBetween) {
      const { error } = await supabase
        .from("units")
        .delete()
        .eq("name", nameToRemove)
        .eq("pet", chosenPetName)
        .eq("test_type", selectedType)
        .eq("user_id", user.id);

      if (error) {
        console.error(error);
        return;
      }
    }
  }
    
  useEffect(() => {
    if(!user)
      return

    const updatePossiAndResultsAndUnits = async () => {
      // now remove also the testresult name 
      await removeNameFromTestResults();
      // units have to be removed too
      await removeNameFromUnits();
      setValueToRemoveInBetween([]);  
    };

    if(valueToRemoveInBetween.length){
      updatePossiAndResultsAndUnits(); //db

    }      
  },[getForm])

    // async function resetNewList (cleanedForm){
    //   if(!user) return
    //   console.log("hit bloodtestcontext clean update ", cleanedForm)
    //   //update new form to own possi
    //   const { data: { session } } = await supabase.auth.getSession();
    //   const token = session?.access_token;
    //   const encoded = encodeURIComponent(JSON.stringify(cleanedForm));

    //   await fetch(`/api/updateOwnPossi?pet=${chosenPetName}&form=${encoded}&testtype=${selectedType}`, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });
    // }

    async function removeNameFromTestResults(){
      console.log(' ["mio", "test"] for example',valueToRemoveInBetween)

      const { data: rows, error } = await supabase
        .from("testResult_data")
        .select("id, data")
        .eq("pet", chosenPetName)
        .eq("user_id", user.id);

        if (error) {
          console.error(error);
          return;
        }

        //remove names from valuetoremoveinbetween in testresults
        for (const row of rows) {
          const updatedData = row.data.filter(item => {
            const obj = JSON.parse(item);
            return !valueToRemoveInBetween.includes(obj.name);
          });

          const { error: updateError } = await supabase
            .from("testResult_data")
            .update({ data: updatedData })
            .eq("id", row.id);

          if (updateError) {
            console.error(updateError);
          }
        }
    }

    
    async function handleNewIniForm(cleanedForm) {
      if(user == null){
        setNotification_warn(true)
        setNotification_warn_message("Please log in.")
        setNotification_warn_color("warning")
        
        setLoading(false)
        return
      }
      const getPossibleValuesAdmin = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        const res = await fetch(`/api/getPossibleVal?pet=${chosenPetName}&lookForAdminsMatch=true&testtype=${selectedType}`, {
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

          let dbAdminFormNotEqual;
          const flatPossibleValAdmin = possibleValAdmin.flat();

          //if removed
          if (cleanedForm.length !== flatPossibleValAdmin.length) {
            dbAdminFormNotEqual = true;
            return dbAdminFormNotEqual;
          }
          //id added new possi to form
          dbAdminFormNotEqual = cleanedForm.some(a => {
            return !flatPossibleValAdmin.some(b => b.name === a.name);
          });
          // console.log("is NOT ------------ equal to aadmin form ", dbAdminFormNotEqual)
          return dbAdminFormNotEqual;
      }

      const getPossibleValueOwn = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        const res = await fetch(`/api/getPossibleVal?pet=${chosenPetName}&lookForAdminsMatch=false&testtype=${selectedType}`, {
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
          console.log("api - postownpossi")
          await fetch(`/api/postOwnPossi?pet=${chosenPetName}&form=${encoded}&testtype=${selectedType}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
      } 
    }

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

      getForm.forEach(({ keyword, name, exclude }) => {
        if (exclude && line.includes(exclude)) return;
        if (keyword && keyword.some(k => line.includes(k))) {
          const field = getForm.find(f => f.name === name);
          if (field) {
            field.value = Number(numMatch)
            
            const getSettedUnit = usersUnits.find(
              (colDB) => colDB.name == name 
            );

            const unitDB = usersUnits.find(
              (colDB) => colDB.name == name && colDB.fromUnit == getSettedUnit.settedUnit
            );

            const normalizedValue = unitDB
            ? Number((unitDB.factor * Number(field.value)).toFixed(4))
            : field.value;

            // const numericValue = field.value === "" ? "" : parseFloat(field.value);
            setForm((prev) =>
              prev.map((field) =>
                field.name === name
                  ? { 
                    ...field, 
                      normalizedValue: normalizedValue,
                      originalUnit: getSettedUnit?.settedUnit
                  }
                  : field
              )
            );
          };
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
      getNames, handleNewIniForm,
    delDocs, editDocs, checkUsersLimit, bloodTestCompReset, resetInputForm,
      setBloodTestCompReset, getDocsImg, getDocImg, handleClickPreviewImg_fromDocs, 
      handleClickPreviewImg_forExtraction, handleFileChange, selectedImage, 
      setSelectedImage, chosenPetName, savedPetNames, allNames, fetchInitialFormTemplate,
      resetForm, resetFileComp, fileKey, file, setFile, handleExtractAndSave,
      extractedText, addUnitToDB, addNewUnitToForm, getUnits }}>
      {children}
    </BloodTestContext.Provider>
  );
};

export const useBloodTestContext = () => useContext(BloodTestContext);
