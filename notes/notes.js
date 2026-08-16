// add in form.js span.with-more-options back in when logic and data feeding is ready
//  <TextField
//                 className='input-wide'
//                 select
//                 label="Test type"
//                 value={selectedType}
//                 onChange={(e) => {
//                     setSelectedType(e.target.value);
//                 }}
//                 // helperText="Please select your test type"
//                 >
//                 {testType.map((option) => (
//                     <MenuItem key={option.value} value={option.value}>
//                     {option.label}
//                     </MenuItem>
//                 ))}
//               </TextField>
//                <PetNameInput requiredByForm="true" />


//             <span className='with-more-options'>
//               <h2><Filter3RoundedIcon />Add/Edit Values </h2>  
//               <MoreVertIcon
//                 className='more-options'
//               />
//               <span className='more-options-button'>
//                 <Button 
//                   disabled={getForm.length === 0}
//                   variant="contained"
//                   sx={{ color: '#fff' }} 
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setForm([])
//                   }}
//                 >Delete all</Button>
//                 <Button 
//                   variant="contained"
//                   sx={{ color: '#fff' }}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     if(!selectedType){
//                         setNotification_warn(true)
//                         setNotification_warn_message("Choose test type in step 2.")
//                         setNotification_warn_color("warning")
//                       return
//                     }
//                     fetchInitialFormTemplate()
//                   }} 
//                 >Use Template Form</Button>
//               </span>
//             </span>
//and
//  <Box
//             component="form"
//             sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
//             noValidate
//             autoComplete="off"
//             className='box'
//         >   
//             { getForm.length == 0 &&
              
//               <Button 
//                 variant="contained"
//                 sx={{ color: '#fff' }}
//                 onClick={(e) => {
//                 e.preventDefault();
//                 if(!selectedType){
//                     setNotification_warn(true)
//                     setNotification_warn_message("Choose test type in step 2.")
//                     setNotification_warn_color("warning")
//                   return
//                 }
//                 fetchInitialFormTemplate()
//               }}
//               >use template form</Button>

//             }

// current

// next
  // units admins have to be useable for users who dont have that unit saved for themself

// info
  // setNotification_warn(true)
  // setNotification_warn_message("You have reached the limit of 4 uploads.")
  // setNotification_warn_color("warning")

  //https://ckd-tracker.vercel.app/
  
  //icons
  //➕
                      
                      

//next form.js
  // refactor
    // form.js post testresult only with its value anyway? since no keyword, minmax etc not needed and only confuses
    // and also need to extend that in future anyway with original unit wert and normilized unit data wert

// next (form.js)
  // user based fetch possible values, if no own ones from pet, then get admins ini form - that the iniform and form sets in form
  // remove input options 

    
  //db extend
    // possible values in bloodtest to db and fix up for blood and urine
      // Hämatologie → EDTA / Blut
      // Klinische Chemie / (Blut) Serumchemie → Serum
      // Harnuntersuchung / Urinstatus → Harn
      
  //     ui 
  // ☑ Blut (alle)
  // ☑ Serum
  // ☑ EDTA-Blut
  // ☑ Urin


// restructure
  //urin and blood results can be mixed
  // urin can stand alone
  // blood can stand alone
  // main charts / separate charts need blood and urin switch if i want to specify
  // does not count since we need it only to compare (urine hometests)

  

//done 
  // chart.js
    //slider for visual range in values
    //scrollup /down visualize features or hide for better ux and view
  //form.js / chart.js 
    //multi keywords
 // possi got updated unwillingly overwritten by reload from old data?
      // possi mit lii auf chart -> dann code change triggered relaod -> suddenly i had admins ini form from the raloads ini petname after i changed back to lii
      // bevor form updates, nochmal abfrage, before es dann in possi geändert wird?
        //def check cases 
        // done // - add new val on nonexisting pet
        // done noCase // - add new val on existing pet but empty possi (possible even?)
        // done // - add new val on normal case (with existing pet & possi)
        // done // - chart -> change value func
        

  

//important
//behavoir to keep in mind
  //upload site
    //once added new value its saved to db without submitting testresult
    //once removed an value, testresult must be submitted together in the process to update that form to db
      //because in case we clear the form/template, we have no data anymore

//todo
  //charts - compare function 
    //for home test to lab
    //for two different pets (blus and lee any correlation for seasons)
  // dashboaard as hospital
  // for vet -
    // make vet acc to only see jasmins data
  //update forms
    //options to add marker, values to form comp
  //docs dashboard -> docs comp that gets also integrated with the other comps 
    //(bloodtest and form etc?)
  // chart comp side menu height of rainbow btns fix
  // git pushed to side branch refactor
  // fill up all data in context like with first 3
  // fill their min max and currency
  // pdf print from graph
  //add editable extracted data in the visualized data
  //export function for vet etc
  //pets data overview
  //medical informations to tracked values - to high / to low consequences



// vet note
  // einheiten 



//old done
  // remove val in possi -> remove name in units too
  //form.js shows for each possi options of units
    //make it not save in the possi db so on reload the old data are not there still
    //in chart is value from the getForm used and not the normalized one - admin uses only value and has no normilized -> use here in that showcase the value
    //ini add possi with units in form.js
    //and new unit function options 
    //unit calc 
  // form.js
    // template form button that fetches admins form 
    // possi instant fetch of update, add or remove bug fix 
    // added to notification extra link to instantly reach chart after successfully adding testresult
  // bug fix, admins data untouchable, and avoid that del the whole possi into empty arr
    // refactored
      // possi db gets testtype + adds new row if new testtype (blood/urine) 
      // btn form functions form.js use template form
      // so in form and later in result they can be filtered based on with selectedtype 
  // form.js and bloodcontext
    // for deleting possi we need to del it also in testresult 
  // ui form.js mobile with 2 inputs next to each
  // ui notification mobile text fix
  // form.js for add new possi we need to check if the name doesnt exist already,
  //sepa chart
      // edit sepa chart values input for adjusting min max/ units etc
      // ui
      // update db ->  
        // müssen testresult fetch machen und alten wert raus und neue keywords rein    
        // doch nicht weil testresult nur value und namen zieht sowieso
  //form.js 
    //adjust del process, -> from instant del to selection and then agreeing to del
 // del value in form input - form.js from possible_values db
 // add search + filter badges in sepa chart with zustand
    //ui ux to improve
      //sticky version with ref and observer 
      //filter search offers autocompllete
      //removable filter badges in one go or single
  // fix in sepa chart the visibility for out of range datas
  // fetch possible_values from db -> for the names and infos like minmax
    // in chart.js -> instead of using hardcoded bloodtestcontext iniData
    // and in bloodtest.js (uploadsite) -> for inputs/values 
      // api -> getInputValues.js
  // new input fix -> only once working so far
    //added api for updating existing inputValues (possible_values)
  // fix by adding new input and switch to chart, graph doesnt show or update new data
    // added form/setForm as zustand store
  //add input field manually to get arr in bloodtestcontext extended
    // fix for multiple adds
    // -> BloodtestContext.js
      // -> getInitialForm -> sets form -> that sends new values to db is there
      // which has func resetNewList -> sets form from Form.js to add new inputs to db
    //auth
      //no auto login into the gmail connected mail from browser, instead choosing option
    // keywordmapping in blood context - key to name renamed
      //to align the ini form with name 
    // added policy for possible_val to read admin ini form
    //bloodtestcontext
      // fixed checkLimitSave for backend
    //db extend
      // possible__values compare admins arr to own
        // step: in blood context mit resetNewList
        // step: admin form ini saved in db
        // step: compare admins form to current one
        // next: add new form to own data if it differs
          // - own possi
          // - admin possi same?
          // - add new/do nothing
  //bloodtest comp - rearrange ui and responsive design
  //bloodtest comp
    // added ux notifications by unfilled form  
  //complete docdel on storage deletion
  //docs pathfile save with name
  // docs comp del file with notifications
    // more options funcs in admin to reject 
  //ui for docs comp - more options
  // nextjs and react updats due to security
  // fix fetch in getDocs.js, getPetname.js and getTestResult for logged in and not logged in
  //bloodtest comp - admins example data batch
  //chart comp - main chart remove at mobile the val
  //quick fix overlay with menu collapses
  //refactor style 
    //auth comp for mobile 
  //style refactor 
    //auth comp
  //style refactor 
    //menu comp with login options
  //style refactor 
    //menu - header and mobile start, with logo
  //menu comp
    //fix flackering in loggin by user id and loading context
  //blood test comp 
    // limit users added blood test files to save to db
    // notify message
  //menu style - sticky 
  //bloodtestcomp
    //not logged users cant save -> error message
  //login message comp and context
  //menu comp
    //login/logout and menu start
  // docs comp
    //img item now dynamic from db 
    // fix style und save data refreshs doc wrapper
  //refactor
    //docs review overlay expansion
  // refactor
    // chart context (fetch Testdata) - to server side code from context for api in getTestResults.js
  //security -admin supabase policies for vet and dev, show all rows 
    //for other users show only own rows and dev row
  //expand for parent profiles /animals
    //form comp -> extend pet name
      //fetch pet names as dropdown
      //add new pet names
    //filter chart comp by pet name chosen logic
      // add same auto input in chart 
      // petnameinput comp added
      // chartcontext- fetching chart data based on petnameinput
  //blood comp 
    // added preview img
    // style - scrollable extracted text
      // overlayer for preview img
      // fix shadow style and point when to start -ux style
  //chart comp 
    // style val color
    // (only separated charts) white val numbers
    // refactor into context
  //chart comp ->
    // visulize extracted data 
    // style chart comp - add side menu
      // btns (show all/hide all values)-> graph always 100% in view 
      // add search to filter in side menu values -> neatless switch 
      // add date picker range 
    //style (btns color bound to values and graphs, line charts)
  // BloodTest comp when uploading file, hold globally, for Form comp when saveToDb gets triggered, to add File also to docs
  // done global file state
  // Form Comp with their data input context + saving to db
  //loading context
  //supabase policy for bloodtest table read, add and delete
  // add data to db from input
  // added user specific data values for the tests, able to flag as important, fav etc
  // filter test data in main chart
  // separate charts for indivisual datas

// details
  // chart comp
    // side menu - calender - add date range from last saved localstorage
    // chart all -> show data that are out of range from there min max 
    // chart all -> show an up or down trend from vals in their graph -> creatinin ^ or opposite
    // when value in sep.Chart gets out of the chart -> write val? changeable min max?
    // overview in bottom sticky for values that changes quite (in minus and then the plus - gango lavoro bluo)
  // refactor blood context - key/name to display the name in charts
  // refactor into chartContext 
  //use abort in fetches
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



  //branches (+possible ones)
    // bloodtest visualization
    // *refactor_chart_and_bloodtest_input_comp
    // user profile - pets
    // urinetest visualize
    // overview dashboard
    // notes dashboard? marker (travel, changes like food change, bladder infec. etc)
    // details (ui ux)
    // extending for more users?
    // vet communitation
    // ai analyse


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
    // ::check let c_leukozytenVal; //entzündungs- & infektionszeichen
    // ::check neu Erythrozyten
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




//     [
//   "{\"name\":\"a_Kreatinin\",\"value\":\"\",\"keyword\":[\"Kreatinin\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"a_kaliumVal\",\"value\":\"\",\"keyword\":[\"Kalium\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"a_kalziumVal\",\"value\":\"\",\"keyword\":[\"Kalzium\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"a_natriumVal\",\"value\":\"\",\"keyword\":[\"Natrium\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"a_chloridVal\",\"value\":\"\",\"keyword\":[\"Chlorid\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"a_albuminVal\",\"value\":\"\",\"keyword\":[\"Albumin\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"a_eisenVal\",\"value\":\"\",\"keyword\":[\"Eisen\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"a_magnesiumVal\",\"value\":\"\",\"keyword\":[\"Magnesium\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"a_naKQuotientVal\",\"value\":\"\",\"keyword\":[\"Na-/K-Quotient\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"a_AGQuotientVal\",\"value\":\"\",\"keyword\":[\"Na-/K-Quotient\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"a_T4Val\",\"value\":\"\",\"keyword\":[\"T4\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"a_hämatokritVal\",\"value\":\"\",\"keyword\":[\"hämatokrit\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"a_retikulozytenVal\",\"value\":\"\",\"keyword\":[\"Retikulozyten\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"a_retHeVal\",\"value\":\"\",\"keyword\":[\"Ret-He\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"b_alphaAmylaseVal\",\"value\":\"\",\"keyword\":[\"Amylase\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"b_dggrLipaseVal\",\"value\":\"\",\"keyword\":[\"DGGR-Lipase\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"b_glukoseVal\",\"value\":\"\",\"keyword\":[\"Glucose\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"b_fuctosaminVal\",\"value\":\"\",\"keyword\":[\"Fructosamin\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"b_triglyzerideVal\",\"value\":\"\",\"keyword\":[\"Triglyceride\",\"Trigiyceride\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"b_cholesterinVal\",\"value\":\"\",\"keyword\":[\"Cholesterin\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"b_bilirubinVal\",\"value\":\"\",\"keyword\":[\"Bülrubin\",\"Bilirubin\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"b_APVal\",\"value\":\"\",\"keyword\":[\"AP\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"b_GLDHVal\",\"value\":\"\",\"keyword\":[\"GLDH\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"b_GGTVal\",\"value\":\"\",\"keyword\":[\"G-GT\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"b_ALTVal\",\"value\":\"\",\"keyword\":[\"ALT\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"b_ASTVal\",\"value\":\"\",\"keyword\":[\"AST\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"b_CKVal\",\"value\":\"\",\"keyword\":[\"CK\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"b_gesamtProteinVal\",\"value\":\"\",\"keyword\":[\"Protein\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\",\"min\":57,\"max\":94}",
//   "{\"name\":\"b_globulineVal\",\"value\":\"\",\"keyword\":[\"Globuline\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"c_neutrophileVal\",\"value\":\"\",\"keyword\":[\"Neutrophile\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"c_MCV\",\"value\":\"\",\"keyword\":[\"MCV\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"keyword\":[\"MCH\"],\"name\":\"c_MCH\",\"exclude\":\"MCHC\",\"value\":\"\",\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"c_MCHC\",\"value\":\"\",\"keyword\":[\"MCHC\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"c_hypochromasie\",\"value\":\"\",\"keyword\":[\"Hypochromasie\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"a_hämoglobinVal\",\"value\":\"\",\"keyword\":[\"hämaglobin\",\"hämoglobin\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"min\":108,\"max\":169,\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"c_erythrozytenVal\",\"value\":\"\",\"keyword\":[\"Erythrozyten\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"min\":7.2,\"max\":11,\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"c_leukozytenVal\",\"value\":\"\",\"keyword\":[\"Leukozyten\",\"Leukoz\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"min\":3.9,\"max\":12.5,\"datum\":\"2025-12-31\"}",
//   "{\"name\":\"c_anisozytose\",\"keyword\":[\"Anisozytose\"],\"value\":\"\",\"probe\":\"Serum\",\"material\":\"Blut\"}",
//   "{\"name\":\"Index (urin)\",\"value\":\"\",\"keyword\":[\"Index\"],\"probe\":\"Labor\",\"material\":\"Urin\",\"datum\":\"2022-05-14\",\"min\":0,\"max\":0.2}",
//   "{\"name\":\"Calcium\",\"value\":\"\",\"keyword\":[\"Calcium\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2022-05-14\",\"min\":2.3,\"max\":3}",
//   "{\"name\":\"Ca ionisiert\",\"value\":\"\",\"keyword\":[\"Ca ion\"],\"probe\":\"Serum\",\"material\":\"Blut\",\"datum\":\"2022-05-14\",\"min\":1.07,\"max\":1.47}",
//   "{\"name\":\"Eiweiß (urin)\",\"value\":\"\",\"keyword\":[\"Eiweiß\"],\"probe\":\"Labor\",\"material\":\"Urin\",\"datum\":\"2022-05-14\"}",
//   "{\"name\":\"Krea. (urin)\",\"value\":\"\",\"keyword\":[\"Krea\"],\"probe\":\"Labor\",\"material\":\"Urin\",\"datum\":\"2022-05-14\"}",
//   "{\"name\":\"test\",\"value\":\"\",\"keyword\":[\"Krea\"],\"probe\":\"Labor\",\"material\":\"Urin\",\"datum\":\"2022-05-14\"}",
//   "{\"name\":\"oooooo\",\"keyword\":[\"o\"],\"probe\":\"o\",\"material\":\"o\",\"datum\":\"2026-07-27\",\"min\":null,\"max\":null,\"unit\":\"\",\"value\":\"\"}"
// ]