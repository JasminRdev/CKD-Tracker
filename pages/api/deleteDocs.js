import { createClient } from "@supabase/supabase-js";
import { supabase as publicClient } from "../../app/lib/supabaseClient";

export default async function handler(req, res) {
  const { fileUrl } = req.query;
  
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

  // const { data, error } = await dbClient
  //   .from("testResult_data")
  //   .select("*")
  //   .order("pet", { ascending: true });
  let userDoesntDeleteAdmins = fileUrl.includes(user.toString())
  console.log("here jas ", fileUrl.includes(user.toString()), fileUrl, user)
  // if(userDoesntDeleteAdmins){
  //   const { error } = await dbClient
  //     .from('testResult_data')
  //     .delete()
  //     .eq('file_url', fileUrl)

  //   if (error) return res.status(400).json({ error: error.message });
  // }     

 

  // return res.status(200).json(data);
}
