import { createClient } from "@supabase/supabase-js";
import { supabase as publicClient } from "../../app/lib/supabaseClient";


export default async function handler(req, res) {
  const { fileUrl } = req.query;
  const { docId } = req.query;
  
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
    //remove in storage first - only img
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

    // then remove in testresult - plus data whole data
    try {
      const { error } = await dbClient
        .from('testResult_data')
        .delete()                            
        .eq('id', docId)

      return res.status(200).json({
        message: "Document deleted successfully",
      });
    } catch (err) {
      return res.status(500).json({
        error: "Document deletion failed.",
      });
    }

  } else {
    return res.status(500).json({
      error: "No access right to delete admins document.",
    });
  } 

 

  // return res.status(200).json(data);
}
