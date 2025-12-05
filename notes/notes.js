// current
    // thwn with option of removing with the other ui options
    // ::next add functionality
      // delete in testresult table ::done (documents.js und delApi)
      // and documents
        //same way for edit ::current
    // change docs admin file path insert method to "admin/filename"
      // to not expose the id of admin


// note -> if path doc contains my id then add removing possible
//   -> then ask if sure bc its deleting the data from the graph

// remove, replace, download options




//todo
  // add notifications 
    //bloodtest comp upload result
  // vor vet -
    // make vet acc to only see jasmins data
  //update forms
    //with einheiten
    //options to add marker, values to form comp
  //blooftest comp
    //refresh once data saved from bloodtest input
  // next we visually show for admin own and other uers data - batch from user?
    // look whio i am as logged person! 
  //docs dashboard -> docs comp that gets also integrated with the other comps 
    //(bloodtest and form etc?)
  // chart comp side menu height of rainbow btns fix
  // git pushed to side branch refactor
  // fill up all data in context like with first 3
  // fill their min max and currency
  // pdf print from graph
  //add editable extracted data in the visualized data
  //add/delete datas
  //dashboard for uploaded files
  //dashboard for additional notes that are linked to the diagrams from visualized data
  //export function for vet etc
  //pets data overview
  //medical informations to tracked values - to high / to low consequences
  // global Loading comp 


//done
  //docs pathfile save with name
  // docs comp del file with notifications
    // more options funcs in admin to reject 

// vet note
  // einheiten 



//old done
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
