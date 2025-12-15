

  import { createClient } from "@supabase/supabase-js";
  import { supabase as publicClient } from "../../app/lib/supabaseClient";
  
  export default async function handler(req, res) {

    const { fileUrl } = req.query;
    const { docId } = req.query;

    const petName = fileUrl.split(user.id.toString() + "/")[1].split("/")[0];
    console.log("show hit ", petName)
    return;
    
    if (!fileUrl) {
      return res.status(400).json({ error: "fileUrl name is required" });
    }
    
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : null;
  
    const isValidJwt = token && token.split(".").length === 3;
  
    // Select correct Supabase client
    const dbClient = isValidJwt
      ? createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          {
            global: {
              headers: { Authorization: `Bearer ${token}` },
            },
          }
        )
      : publicClient; // Logged out user
  
    // Now safely get user
    const {
      data: { user },
    } = await (isValidJwt
      ? dbClient.auth.getUser()
      : { data: { user: null } });
  
    let userDoesntDeleteAdmins = fileUrl.includes(user.id.toString())
    if(userDoesntDeleteAdmins){
      //copy
        try{
            const {error} = await dbClient
              .storage
              .from('documents')
              .copy(fileUrl.split("documents/")[1].replaceAll("%20", " "), user.id +"/" + petName + "/" + newFileName);
            } catch (err) {
            return res.status(500).json({
              error: "Document edit failed. - Please contact the developer.",
            });
          }
  
        //update file_url in testresult
       try {
        const { data, error } = await dbClient
            .from('testResult_data')
            .update({ file_url: "https://svnfyavkjzyfvtjiuewf.supabase.co/storage/v1/object/public/documents/" + user.id + "/" + petName + "/" + newFileName })
            .eq('id', docId)
            .select()

        //remove old completly from storage
         if(!error){
            try{
            const {error} = await dbClient
                .storage
                .from('documents')
                .remove(fileUrl.split("documents/")[1].replaceAll("%20", " "))
            } catch (err) {
            return res.status(500).json({
                error: "Document deletion failed. - Please contact the developer.",
            });
            }
        }
        return res.status(200).json({
        message: "Change successfull",
        });
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
        error: "Change failed.",
        });
    }

    } else {
      return res.status(500).json({
        error: "No access right to change admins document.",
      });
    } 
  
   
  
    // return res.status(200).json(data);
  }
  